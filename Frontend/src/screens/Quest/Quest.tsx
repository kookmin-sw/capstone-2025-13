import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import Header_sky from "../../components/Header_sky";
import Quest_circle from "../../components/Darkgreen_circle";
import Street from "../../components/Street";
import Street_basic from "../../components/Street_basic";
import questStyles from "../../styles/questStyles";
import Tree from "../../components/Tree";

const treeTypes: ("apple" | "peach" | "forest")[] = ["apple", "peach", "forest"];

const { height } = Dimensions.get("window");

const questData = [
  { title: "돌아보기", subtitle: "스스로를 돌아보는 시간이에요." },
  { title: "명상", subtitle: "조용한 마음을 가져봐요." },
  { title: "운동", subtitle: "몸을 움직여볼까요?" },
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
          <Header_sky title= "퀘스트" subtitle="미션을 완료해보세요!"  screenName="Quest" />
          <Quest_circle style={questStyles.circle} />
        </View>

        <View style={questStyles.elementsOverlay}>
        {questData.map((quest, index) => {
          const isLeft = index % 2 === 0;
          const isFirst = index === 0;
          const isLast = index === questData.length - 1;

  return (
    <React.Fragment key={index}>
      {index !== 0 && (
        <Street
          direction={isLeft ? "left" : "right"}
          style={[questStyles.street, { top:
            index === 1
              ? height * 0.1 + (height * 0.2) * index - height * 0.18
              : height * 0.1 + (height * 0.2) * index - height * 0.16,
          }]}
        />
      )}

      <View
        style={[
          questStyles.elementWrapper,
          {
            alignSelf: isLeft ? "flex-start" : "flex-end",
            marginTop: isFirst ? height * 0.025 : height * 0.01,
          },
        ]}
      >
        <Tree
          type={treeTypes[index % treeTypes.length]}
          title={isFirst ? `${nickname}의 숲` : quest.title}
          subtitle={quest.subtitle}
        />
      </View>

      {isLast && (
        <Street_basic
          style={[
            questStyles.street,
            {
              top:
                  height * 0.2 * questData.length -
                  height * 0.1,
            },
          ]}
        />
      )}
    </React.Fragment>
  );
})}

        </View>
      </ScrollView>
    </View>
  );
}
