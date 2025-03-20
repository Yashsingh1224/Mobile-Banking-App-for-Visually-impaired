import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { Audio } from "expo-av";

const WIT_AI_API_KEY = "S4BHXUYQGRV2MCADTUZVBUAMSZBVOHA5"; // Replace with your Wit.ai API key

const VoiceRecognition = () => {
    const [recording, setRecording] = useState(null);
    const [transcription, setTranscription] = useState("");

    const startRecording = async () => {
        try {
            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                console.error("Microphone permission not granted");
                return;
            }

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync({
                android: {
                    extension: ".wav",
                    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
                    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
                    sampleRate: 16000, // 16kHz required for Wit.ai
                    numberOfChannels: 1,
                    bitRate: 128000,
                },
                ios: {
                    extension: ".wav",
                    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
            });

            await recording.startAsync();
            setRecording(recording);
            console.log("🎙 Recording started...");
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };


    const stopRecording = async () => {
        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);
            console.log("🎤 Recording stopped. Sending to Wit.ai...");
            sendToWitAI(uri);
        } catch (error) {
            console.error("Error stopping recording:", error);
        }
    };

    const sendToWitAI = async (audioUri) => {
        try {
            console.log("📤 Uploading audio to Wit.ai...");

            const response = await fetch(audioUri);
            const audioBlob = await response.arrayBuffer(); // Convert to arrayBuffer

            const witResponse = await fetch("https://api.wit.ai/speech?v=20230217", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${WIT_AI_API_KEY}`,
                    "Content-Type": "audio/wav", // Ensure correct content type
                },
                body: audioBlob,
            });

            const data = await witResponse.json();
            console.log("📝 Full Wit.ai Response:", data);

            if (data.text) {
                setTranscription(data.text);
                if (data.text.toLowerCase().includes("login")) {
                    handleLogin();
                }
            } else {
                console.warn("⚠️ Wit.ai didn't return any transcription.");
            }
        } catch (error) {
            console.error("Error processing speech:", error);
        }
    };

    const handleLogin = () => {
        console.log("🔐 Login triggered!");
        // Add your login function here
    };

    return (
        <View>
            <Button title="Start Recording" onPress={startRecording} />
            <Button title="Stop Recording" onPress={stopRecording} />
            <Text>Recognized Text: {transcription}</Text>
        </View>
    );
};

export default VoiceRecognition;
