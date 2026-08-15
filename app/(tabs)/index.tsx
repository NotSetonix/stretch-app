import { useRouter } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { STRETCHES } from '../../data/stretches';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 60, paddingHorizontal: 20 }}>
      <FlatList
        data={STRETCHES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/stretch/${item.id}`)}>
            <Text style={{ fontSize: 18, color: 'black', paddingVertical: 12 }}>
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}