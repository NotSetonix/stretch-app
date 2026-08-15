import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const [showSeconds, setShowSeconds] = useState(true);
  const [beginnerOnly, setBeginnerOnly] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingTop: 60, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 24 }}>Settings</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' }}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={{ fontSize: 16 }}>Show hold times</Text>
          <Text style={{ fontSize: 13, color: '#777', marginTop: 2 }}>Display how long to hold each stretch</Text>
        </View>
        <Switch value={showSeconds} onValueChange={setShowSeconds} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' }}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={{ fontSize: 16 }}>Beginner stretches only</Text>
          <Text style={{ fontSize: 13, color: '#777', marginTop: 2 }}>Hide anything marked Medium difficulty</Text>
        </View>
        <Switch value={beginnerOnly} onValueChange={setBeginnerOnly} />
      </View>

      <Text style={{ marginTop: 32, fontSize: 13, color: '#999' }}>
        Desk Reset v1.0 · Stretch guidance is general information, not medical advice.
      </Text>
    </ScrollView>
  );
}