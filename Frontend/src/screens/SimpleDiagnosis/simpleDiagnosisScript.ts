import { RootStackParamList } from "../../App";

type StorySegment = {
    index: number;
    type: "story";
    name?: string;
    text?: string;
    backgroundImage?: any;
    options?: ChoiceOption[]
  };
  
  type ChoiceOption = {
    text: string;
    nextType: "story" | "navigate" | "options";
    nextIndex?: number;
    navigateTo?: {
        screen: keyof RootStackParamList;
        params?: any;
    };
    score?: number;
};


type ChoiceSegment = {
  index: number;
  type: "options";
  options: ChoiceOption[];
  backgroundImage?: any;
};

type NavigateSegment = {
  index: number;
  type: "navigate";
  navigateTo: keyof RootStackParamList;
  backgroundImage?: any;
};

type ScriptSegment = StorySegment | ChoiceSegment | NavigateSegment;


export const simpleDiagnosisScript: ScriptSegment[]  = [
    {
      index: 0,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-1.png"),
      name: "나",
      text: "하 목말라...\n물마시고 싶당\n어디 쉴 데 없나?",
    },
    {
      index: 1,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-2.png"),
      name: "나",
      text: "집이다!\n물 한잔 얻어 먹어야지!!",
    },
    {
      index: 2,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-3.png"),
      name: " ",
      text: "(똑똑)",
    },
    {
      index: 3,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-3.png"),
      name: "세잎이",
      text: "(...끼익)\n어머 너 누구야?\n우리 어디서 본 적 있나?",
    },
    {
        index: 4,
        type: "options",
        backgroundImage: require("../../assets/Images/simple-3.png"),
        options: [
          { text: "네", nextType: "navigate", navigateTo: { screen: "SignIn" } },
          { text: "아니요", nextType: "story", nextIndex: 6 },
        ],
      },
      
    {  index: 5,
        type: "navigate",
        navigateTo: "SignIn",
    },
    {
      index: 6,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-3.png"),
      name: "나",
      text: "혹시 물 한 잔만,, 주실 수 있을까요?",
    },
    {
      index: 7,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-3.png"),
      name: "세잎이",
      text: "들어와, 들어와!\n너 이름이 뭐니?",
    },
    {
      index: 8,
      type: "navigate",
      navigateTo: "SignUpStep1",
    },
    {
      index: 9,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-3.png"),
      name: "세잎이",
      text: "아 이름이 ~~구나!\n멋진 이름이야!\n너에 대해서 조금 더 알려줘!",
    },
    {
      index: 10,
      type: "navigate",
      navigateTo: "SignUpStep2",
    },
    {
      index: 11,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-3.png"),
      name: "세잎이",
      text: "너가 다시 왔을 때 기억할 수 있게 다음 정보 입력해줄래?",
    },
    {
      index: 12,
      type: "navigate",
      navigateTo: "SignUpStep3", 
    },
    {
      index: 13,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-4.png"),
      name: "세잎이",
      text: "아하 그렇구나!\n여기 물!",
    },
    {
      index: 14,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-4.png"),
      name: "세잎이",
      text: "근데 여기는 어쩌다가 오게 되었어?",
    },
    {
      index: 15,
      type: "options",
      backgroundImage: require("../../assets/Images/simple-4.png"),
      options: [
        { text: "나를 찾으러 왔어 ",nextType: "story", score: 0, nextIndex: 16 },
        { text: "사랑 찾아 왔어 💕",nextType: "story", score: 0, nextIndex: 16 },
        { text: "요즘 다 재미가 없어서,,", nextType: "story",score: 1, nextIndex: 16 },
      ],
    },
    {
      index: 16,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-4.png"),
      name: "세잎이",
      text: "혼자 여행 다니는 거 정말 멋있다!\n낭만있구 대단해",
    },
    {
      index: 17,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-4.png"),
      name: "세잎이",
      text: "여행 말고 요즘 관심있는 거 있어?",
    },
    {
      index: 18,
      type: "options",
      backgroundImage: require("../../assets/Images/simple-4.png"),
      options: [
        { text: "응!", nextType: "story",score: 0, nextIndex: 19 },
        { text: "아니, 그치만 새 관심사를 요즘 찾아가는 중이야", nextType: "story",score: 0, nextIndex: 21 },
        { text: "아니, 요즘 아무것도 안 하고 싶어..,", nextType: "story",score: 2, nextIndex: 22 },
      ],
    },
    {
      index: 19,
      type: "navigate",
      navigateTo: "SignUpStep1", // 수정필요요
    },
    {
      index: 20,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-4.png"),
      name: "세잎이",
      text: "우와! 멋지다!\n나도 그거 좋아해!",
    },
    {
      index: 21,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-4.png"),
      name: "세잎이",
      text: "좋다!\n지금 이 여행이 도움 됐으면 좋겠어!",
    },
    {
      index: 22,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-4.png"),
      name: "세잎이",
      text: "그래, 그럴 때가 있지~",
    },
    {
        index: 23,
        type: "story",
        backgroundImage: require("../../assets/Images/simple-4.png"),
        name: "세잎이",
        text: "(꼬르륵..)\n나 지금 밥 먹으려고 했는데\n너도 먹고 갈래?",
      },
    {
        index: 24,
        type: "options",
        backgroundImage: require("../../assets/Images/simple-5.png"),
        options: [
            { text: "응 좋아 나도 배고팠어!", nextType: "story",score: 0, nextIndex: 25 },
            { text: "요즘 이상하게 계속 배가 고파,\n두 그릇도 가능해",nextType: "story", score: 1, nextIndex: 25 },
            { text: "나 요즘 입맛이 없어서 조금만 먹을게", nextType: "story",score: 1, nextIndex: 25 },
        ],
    },
    {
    index: 25,
    type: "story",
    backgroundImage: require("../../assets/Images/simple-5.png"),
    name: "나",
    text: "잘 먹었어!\n이만 가봐야겠다",
    },
    {
    index: 26,
    type: "story",
    backgroundImage: require("../../assets/Images/simple-6.png"),
    name: "나",
    text: "(끼이익..)",
    },
    {
    index: 27,
    type: "story",
    backgroundImage: require("../../assets/Images/simple-6.png"),
    name: "세잎이",
    text: "(우르르 쾅쾅!!!!)\n비가 너무 많이 오는데 갈 수 있겟어?\n괜찮으면 오늘 하루 여기서 지내도 돼",
    },
    {
    index: 28,
    type: "options",
    backgroundImage: require("../../assets/Images/simple-6.png"),
    options: [
        { text: "웅, 알겠어. 고마워", nextType: "story",score: 0, nextIndex: 29 },
        { text: "헐.. 감동이야 😭", nextType: "story",score: 0, nextIndex: 29 },
    ],
    },
    {
    index: 29,
    type: "story",
    backgroundImage: require("../../assets/Images/simple-7.png"),
    name: "세잎이",
    text: "비오니까\n괜히 좀 가라앉는 기분이네,,",
    },
    {
    index: 30,
    type: "options",
    backgroundImage: require("../../assets/Images/simple-7.png"),
    options: [
        { text: "나도 비오면 좀 센치해져", nextType: "story",score: 0, nextIndex: 31 },
        { text: "나는 비 오는 날 좋아!", nextType: "story",score: 0, nextIndex: 31 },
        { text: "난 비 오지 않아도 우울해...", nextType: "story",score: 2, nextIndex: 31 },
        ],
    },
    {
        index: 31,
        type: "story",
        backgroundImage: require("../../assets/Images/simple-7.png"),
        name: "세잎이",
        text: "분위기 띄울 겸\n같이 게임 한 판 할래??",
    },
    {
        index: 32,
        type: "navigate",
        navigateTo: "Game",
    },
    {
        index: 33,
        type: "story",
        backgroundImage: require("../../assets/Images/simple-7.png"),
        name: "세잎이",
        text: "오 잘하는데?",
    },
    {
        index: 34,
        type: "story",
        backgroundImage: require("../../assets/Images/simple-7.png"),
        name: "세잎이",
        text: "(하암~)\n게임했더니 피곤하다!\n이만 자러 가자!",
    },
    {
        index: 35,
        type: "options",
        backgroundImage: require("../../assets/Images/simple-8.png"),
        options: [
            { text: "아무생각이 없다", nextType: "story",score: 0, nextIndex: 36 },
            { text: "아니, 나 오늘 정말 알찬 하루였어! 재밌다,,", nextType: "story",score: 0, nextIndex: 36 },
            { text: "내가 오늘 혹시 뭐 실수하진\n 않았을까?걱정이야", nextType: "story",score: 1, nextIndex: 36 },
        ],
    },
    {
        index:36,
        type: "story",
        backgroundImage: require("../../assets/Images/simple-9.png"),
        name: " ",
        text: "(몸이 피곤했는지 스르륵 잠들었다)",
    },
    {
        index:37,
        type: "story",
        backgroundImage: require("../../assets/Images/simple-10.png"),
        name: " ",
        text: "(아침이 밝았다)",
    },
    {
      index:38,
      type: "story",
      backgroundImage: require("../../assets/Images/simple-10.png"),
      name: "세잎이",
      text: "잘잤어?",
  },
    {
        index: 39,
        type: "options",
        backgroundImage: require("../../assets/Images/simple-10.png"),
        options: [
            { text: "완전 푹 잤어!",nextType: "story", score: 0, nextIndex: 40 },
            { text: "아니, 요즘 잠을 잘 못 자",nextType: "story", score: 1, nextIndex: 40 },
            { text: "요즘 잠에서 깨는 게 너무 어려워,,", nextType: "story",score: 1, nextIndex: 40 },
        ],
    },
    {
        index:40,
        type: "story",
        backgroundImage: require("../../assets/Images/simple-10.png"),
        name: "세잎이",
        text: "그렇구나!\n나는 오늘 하루 너무 기대 돼\n너는 어때?",
    },
    {
        index: 41,
        type: "options",
        backgroundImage: require("../../assets/Images/simple-10.png"),
        options: [
            { text: "나도 완전 기대돼 ~", nextType: "story",score: 0, nextIndex: 42 },
            { text: "그게 그거지 뭐...", nextType: "story",score: 1, nextIndex: 42 },
            { text: "벌써 피곤한 기분이야", nextType: "story",score: 2, nextIndex: 42 },
        ],
    },
    {
        index:42,
        type: "story",
        backgroundImage: require("../../assets/Images/simple-10.png"),
        name: "세잎이",
        text: "그렇구나!\n그럼 이제 다시 여행 떠나는 거야?",
    },
    {
        index: 43,
        type: "story",
        backgroundImage: require("../../assets/Images/simple-10.png"),
        name: "나",
        text: "엉\n재워줘서 고마워 안녕!\n또 보자!",
    },
    {
        index: 44,
        type: "story",
        backgroundImage: require("../../assets/Images/simple-1.png"),
        name: "나나",
        text: "클로버 마을...\n여기 마음에 드는 것 같아\n조금 더 돌아보고 싶어",
    },
    {
      index: 45,
      type:"navigate",
      navigateTo: "Home",
    }
  ];
  