// App.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from './supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location';
import { useLocationPolling } from './useLocationPolling';



export default function App() {
  const [destination, setDestination] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [userId] = useState(uuidv4()); // random user ID per install
  const locations = useLocationPolling(roomId);


  const createRoom = async () => {
    const id = uuidv4();
    const { data, error } = await supabase
      .from('rooms')
      .insert([{ id, destination }]);

    if (error) {
      console.log('Error creating room:', error);
      Alert.alert('Failed to create room.');
    } else {
      setRoomId(id);
      Alert.alert('Room Created!', `Room ID: ${id}`);
    }
  };

  const joinRoom = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const { error } = await supabase
        .from('locations')
        .insert([{
          room_id: joinRoomId,
          user_id: userId,
          latitude,
          longitude
        }]);

      if (error) {
        console.error('Error uploading location:', error.message);
        alert('Failed to join room');
      } else {
        console.log('Joined room and shared location.');
        alert('Joined room successfully!');
      }
    } catch (e) {
      console.error('Join room error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Room</Text>
      <TextInput
        placeholder="Enter destination (e.g. India Gate)"
        value={destination}
        onChangeText={setDestination}
        style={styles.input}
      />
      <Button title="Create Room" onPress={createRoom} />
      {roomId && (
        <Text style={styles.roomText}>Your Room ID: {roomId}</Text>
      )}

      <View style={styles.divider} />

      <Text style={styles.title}>Join a Room</Text>
      <TextInput
        placeholder="Enter Room ID to Join"
        value={joinRoomId}
        onChangeText={setJoinRoomId}
        style={styles.input}
      />
      <Button title="Join Room" onPress={joinRoom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8
  },
  roomText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600'
  },
  divider: {
    marginVertical: 30,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
});
