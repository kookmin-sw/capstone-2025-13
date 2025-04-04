import React from "react";
import Home from "./screens/Home";
import DialogueBox from "./components/DialogueBox";
import DialogueChoice from "./components/DialogueChoice";
import SignIn from "./screens/SignIn";
import SignUpStep1 from "./screens/SignUp/SignUpStep1";
import SignUpStep2 from "./screens/SignUp/SignUpStep2";

const App = () => {
    // return <Home />;
    // return <DialogueBox name="세잎이" text="안녕" />;
    return <SignUpStep2 isVisible={true} onClose={() => { }} />;

};

export default App;
