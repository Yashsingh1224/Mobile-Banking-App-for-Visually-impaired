import React from 'react'
import { Link } from "expo-router";
import { View } from "react-native";
import VoiceRecognition from './VoiceRecognition';


const Profile = () => {

    return (
        <>
            <View className="w-full justify-end items-center pt-3 flex-row">
                <Link href="/Login" className="text-lg text-secondary mx-2">Logout</Link>
            </View>
            <VoiceRecognition />
        </>
    )
}
export default Profile
