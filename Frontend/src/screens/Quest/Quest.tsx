import React, { useState, useEffect } from "react";
import { View, ScrollView, Dimensions, Image } from "react-native";
import Header_sky from "../../components/Header_sky";
import Quest_circle from "../../components/Darkgreen_circle";
import Street from "../../components/Street";
import Street_basic from "../../components/Street_basic";
import questStyles from "../../styles/questStyles";
import Tree from "../../components/Tree";
import { getUserInfo, UserInfoResponse } from "../../API/userInfoAPI";
import { useLoading } from "../../API/contextAPI";

const treeTypes: ("apple" | "peach" | "forest")[] = [
    "apple",
    "peach",
    "forest",
];

const { height, width } = Dimensions.get("window");

const questData = [
    { title: "우웅의 숲" },
    { title: "명상" },
    { title: "산책" },
];

export default function Quest() {
    const [user, setUser] = useState<UserInfoResponse | null>(null);
    const { showLoading, hideLoading } = useLoading();

          <View style={questStyles.headerWrapper}>
            <Header_sky title= "퀘스트" subtitle="하루에 하나씩 깨면서 나만의 루틴을 만들어봐요!"  screenName="Quest" />
            <Quest_circle style={questStyles.circle} />
          </View>

    useEffect(() => {
        const fetchUserInfo = async () => {
            showLoading();
            const data = await getUserInfo();
            setUser(data);
            hideLoading();
        };
        fetchUserInfo();
    }, []);

    const nickname = user?.username ?? "우웅";

    return (
        <View style={questStyles.container}>
            <ScrollView
                contentContainerStyle={questStyles.scrollContainer}
                bounces={false}
                overScrollMode="never"
            >
                <View style={questStyles.headerWrapper}>
                    <Header_sky
                        title="퀘스트"
                        subtitle="미션을 완료해보세요!"
                        screenName="Quest"
                    />
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
                                        style={[
                                            questStyles.street,
                                            {
                                                top:
                                                    index === 1
                                                        ? height * 0.1 +
                                                          height * 0.2 * index -
                                                          height * 0.18
                                                        : height * 0.1 +
                                                          height * 0.2 * index -
                                                          height * 0.16,
                                            },
                                        ]}
                                    />
                                )}

                                <View
                                    style={[
                                        questStyles.elementWrapper,
                                        {
                                            alignSelf: isLeft
                                                ? "flex-start"
                                                : "flex-end",
                                            marginTop: isFirst
                                                ? height * 0.025
                                                : height * 0.01,
                                        },
                                    ]}
                                >
                                    <Tree
                                        type={
                                            treeTypes[index % treeTypes.length]
                                        }
                                        title={
                                            isFirst
                                                ? `${nickname}의 숲`
                                                : quest.title
                                        }
                                        nickname={nickname}
                                    />
                                </View>

                                {isLast && (
                                    <>
                                        <Street_basic
                                            style={[
                                                questStyles.street,
                                                {
                                                    top:
                                                        height *
                                                            0.2 *
                                                            questData.length -
                                                        height * 0.1,
                                                },
                                            ]}
                                        />
                                        <Image
                                            source={require("../../assets/Images/clover_good.png")}
                                            style={questStyles.clover}
                                            resizeMode="contain"
                                        />
                                    </>
                                )}
                            </React.Fragment>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}
