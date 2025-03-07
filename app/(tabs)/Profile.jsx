import React from 'react'
import { View, Text } from "react-native";
import { Link, router } from "expo-router";

const Profile = () => {
    return (
        <View className="w-full justify-end items-center pt-3 flex-row">

            <Link href="/Login" className="text-lg text-secondary mx-2">LogOut</Link>
        </View>
    )
}
export default Profile
