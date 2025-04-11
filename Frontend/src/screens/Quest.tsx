import React from "react";
import { ScrollView } from "react-native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Quest_circle";


export default function Quest() {
    return (
        <ScrollView >
            <Header_sky></Header_sky>
                <Quest_circle></Quest_circle>
        
        </ScrollView>
    );
}