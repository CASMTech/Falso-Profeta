import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useGame } from '@/contexts/GameContext';

export default function SetupScreen() {
  const insets = useSafeAreaInsets();
  const { players, addPlayer, removePlayer, startGame } = useGame();
  const [inputName, setInputName] = useState('');
  const inputRef = useRef<TextInput>(null);

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleAdd = () => {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert('Nombre repetido', 'Ya hay un jugador con ese nombre.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addPlayer(trimmed);
    setInputName('');
    inputRef.current?.focus();
  };

  const handleRemove = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    removePlayer(id);
  };

  const handleStart = () => {
    if (players.length < 3) {
      Alert.alert('Pocos jugadores', 'Se necesitan al menos 3 jugadores para comenzar.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    startGame();
    router.push('/reveal');
  };

  const canStart = players.length >= 3;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0E0606', '#1A0808', '#0E0606']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Jugadores</Text>
        <View style={styles.headerRight}>
          <View style={[styles.countBadge, players.length >= 3 && styles.countBadgeReady]}>
            <Text style={styles.countText}>{players.length}</Text>
          </View>
        </View>
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.inputSection}>
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Nombre del jugador..."
            placeholderTextColor={Colors.textMuted}
            value={inputName}
            onChangeText={setInputName}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
            autoCapitalize="words"
            maxLength={20}
            selectionColor={Colors.primary}
          />
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
              !inputName.trim() && styles.addButtonDisabled,
            ]}
            onPress={handleAdd}
            disabled={!inputName.trim()}
          >
            <Ionicons name="add" size={24} color={inputName.trim() ? Colors.text : Colors.textMuted} />
          </Pressable>
        </View>
        <Text style={styles.hint}>
          {players.length < 3
            ? `Agrega ${3 - players.length} jugador${3 - players.length !== 1 ? 'es' : ''} más para comenzar`
            : 'Listo para comenzar la partida'}
        </Text>
      </Animated.View>

      <FlatList
        data={players}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Agrega jugadores para comenzar</Text>
            <Text style={styles.emptySubtext}>Mínimo 3 jugadores</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInRight.duration(300).delay(index * 50)}
            exiting={FadeOutLeft.duration(200)}
            layout={Layout.springify()}
            style={styles.playerItem}
          >
            <View style={styles.playerAvatar}>
              <Text style={styles.playerAvatarText}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.playerName}>{item.name}</Text>
            <Pressable
              onPress={() => handleRemove(item.id)}
              style={({ pressed }) => [styles.removeButton, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="close-circle" size={22} color={Colors.textMuted} />
            </Pressable>
          </Animated.View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: bottomPadding + 16 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && canStart && styles.startButtonPressed,
            !canStart && styles.startButtonDisabled,
          ]}
          onPress={handleStart}
          disabled={!canStart}
        >
          <LinearGradient
            colors={canStart ? [Colors.primary, Colors.primaryDim] : [Colors.border, Colors.border]}
            style={styles.startButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.startButtonText, !canStart && styles.startButtonTextDisabled]}>
              Revelar Roles
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={canStart ? Colors.text : Colors.textMuted}
            />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  countBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeReady: {
    backgroundColor: Colors.primaryDim,
  },
  countText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  addButtonDisabled: {
    borderColor: Colors.border,
  },
  hint: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    paddingLeft: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 10,
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.textMuted,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    opacity: 0.6,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatarText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.gold,
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  startButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonPressed: {
    opacity: 0.85,
  },
  startButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  startButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  startButtonText: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  startButtonTextDisabled: {
    color: Colors.textMuted,
  },
});
