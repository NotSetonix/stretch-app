import { FlatList, Text, View } from 'react-native';
import { STRETCHES } from '../../data/stretches';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 60, paddingHorizontal: 20 }}>
      <FlatList
        data={STRETCHES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 18, color: 'black', paddingVertical: 12 }}>
            {item.name}
          </Text>
        )}
      />
    </View>
  );
}