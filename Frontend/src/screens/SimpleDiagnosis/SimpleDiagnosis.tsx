import { ImageBackground, View } from "react-native";
import DialogueBox from "../../components/DialogueBox";

const SimpleDiagnosis = () => {
    return (

        <ImageBackground
            source={require("../../assets/Images/simple-10.png")}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            resizeMode="cover" // 이미지 크기 조절 (cover, contain 등 가능)
        >
            <DialogueBox
                name="세잎이"
                text="안녕하세요" />
        </ImageBackground>
    )
}

export default SimpleDiagnosis;