import { useEffect, useState, useCallback } from 'react';
import {
  loadTensorflowModel,
  TensorflowModel,
  TensorflowModelDelegate
} from 'react-native-fast-tflite';
import {Platform} from "react-native";

// 전역 싱글톤 관리 객체
class EmotionModelSingleton {
  private static instance: EmotionModelSingleton;
  public tfModel: TensorflowModel | null = null;
  public state: 'unloaded' | 'unloading' | 'loading' | 'loaded' | 'error' = 'unloaded';
  public delegate: TensorflowModelDelegate = Platform.OS == 'ios' ? 'core-ml' : 'default';

  private constructor() {}

  public static getInstance() {
    if (!EmotionModelSingleton.instance) {
      EmotionModelSingleton.instance = new EmotionModelSingleton();
    }
    return EmotionModelSingleton.instance;
  }

  // 모델을 로딩하는 함수 (한번만 실행)
  public async loadModel() {
    if (this.state === 'loaded') {
      return this.tfModel;
    }
    if (this.state === 'loading') {
      // 이미 로딩중이면 기다리지 않고 현재 상태 반환
      return this.tfModel;
    }
    while(this.state == 'unloading') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    this.state = 'loading';
    try {
      this.tfModel = await loadTensorflowModel(require('../assets/models/ResEmoteNet_fer2013_dynamic.tflite'), this.delegate);
      this.state = 'loaded';
    } catch (e) {
      console.error('EmotionModelSingleton loadModel error:', e);
      this.state = 'error';
      this.tfModel = null;
    }
    return this.tfModel;
  }

  public async unload() {
    this.tfModel = null;
    this.state = 'unloaded';
    // ts-ignore
    global.gc?.();
  }
}

export const useEmotionModel = () => {
  const singleton = EmotionModelSingleton.getInstance();

  const [state, setState] = useState(singleton.state);
  const [model, setModel] = useState<TensorflowModel | null>(singleton.tfModel);

  useEffect(() => {
    (async() => {
      let isMounted = true;
      // 모델 로딩
      if (singleton.state === 'unloaded' || singleton.state === 'error') {
        while(singleton.state === 'unloading') {
          await new Promise((resolve) => setTimeout(() => resolve, 100));
        }
        singleton.loadModel().then(() => {
          if (!isMounted) return;
          setState(singleton.state);
          setModel(singleton.tfModel);
        });
        setState('loading'); // 바로 loading으로 표시해주기
      }
      else {
        setState(singleton.state);
        setModel(singleton.tfModel);
      }
      return () => {
        isMounted = false;
      };
    })()
  }, [singleton]);

  // unload 함수를 컴포넌트 외부에서 호출 가능하도록 useCallback 으로 wrapping
  const unload = useCallback(async () => {
    setState('unloading');
    await singleton.unload();
    setState(singleton.state);
    setModel(singleton.tfModel);
    setTimeout(() => global.gc?.(), 300);
  }, [singleton]);

  const load = useCallback(async() => {
    if (singleton.state === 'unloaded' || singleton.state === 'error') {
      while(singleton.state === 'unloading') {
        await new Promise((resolve) => setTimeout(() => resolve, 100));
      }
      singleton.loadModel().then(() => {
        setState(singleton.state);
        setModel(singleton.tfModel);
      });
      setState('loading'); // 바로 loading으로 표시해주기
    }
    else {
      setState(singleton.state);
      setModel(singleton.tfModel);
    }
  }, [singleton])

  return {
    isLoaded: state === 'loaded' && model != null,
    model,
    state,
    unload,
    load
  };
};