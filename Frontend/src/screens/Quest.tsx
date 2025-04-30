import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Darkgreen_circle";
import Street from "../components/Street";
import Street_basic from "../components/Street_basic";
import questStyles from "../styles/questStyles";
import Tree from "../components/Tree"; // 추가

const treeTypes: ("apple" | "peach" | "forest")[] = ["apple", "peach", "forest"];

const { height } = Dimensions.get("window");

const questData = [
  { name: "돌아보기", subtitle: "스스로를 돌아보는 시간이에요." },
  { name: "명상", subtitle: "조용한 마음을 가져봐요." },
  { name: "운동", subtitle: "몸을 움직여볼까요?" },
];

//예시 닉네임
const nickname = "우웅";

export default function Quest() {
  return (
    <View style={questStyles.container}>
      <ScrollView
        contentContainerStyle={questStyles.scrollContainer}
        bounces={false}
        overScrollMode="never"
      >
        
        <View style={questStyles.headerWrapper}>
          <Header_sky subtitle="미션을 완료해보세요!" />
          <Quest_circle style={questStyles.circle} />
        </View>

        <View style={questStyles.elementsOverlay}>
          {questData.map((quest, index) => {
            const isLeft = index % 2 === 0;
            const isFirst = index === 0;

            const treeVerticalMargin = height * 0.00001;

            const topOffset = height * 0.1 + (height * 0.2) * index;

            return (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <Street
                    direction={isLeft ? "left" : "right"}
                    style={[questStyles.street, { top:
                      index === 1
                        ? topOffset - height * 0.18
                        : topOffset - height * 0.16,}]} 
                  />
                )}

                <View
                  style={[
                    questStyles.elementWrapper,
                    {
                      alignSelf: isLeft ? "flex-start" : "flex-end",
                      marginTop: treeVerticalMargin + (index === 0 ? height * 0.022 : height * 0.001),
                    },
                  ]}
                >
                <Tree
                  type={treeTypes[index % treeTypes.length]}
                  name={isFirst ? `${nickname}의 숲` : quest.name}
                  subtitle={quest.subtitle}
                />
                </View>
              </React.Fragment>
            );
          })}
          <Street_basic style={[questStyles.street_basic, { marginTop: height * 0.48}]} />
        </View>
      </ScrollView>
    </View>
  );
}
