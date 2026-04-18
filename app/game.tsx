import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useGame, Player } from '@/contexts/GameContext';

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const { players, character, eliminatePlayer, gamePhase } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom;

  const alivePlayers = players.filter(p => p.isAlive);
  const eliminatedPlayers = players.filter(p => !p.isAlive);

  useEffect(() => {
    if (gamePhase === 'result') {
      router.replace('/result');
    }
  }, [gamePhase]);

  const handleSelectPlayer = (player: Player) => {
    if (!player.isAlive) return;
    Haptics.selectionAsync();
    setSelectedPlayer(player);
    setShowConfirm(true);
  };

  const handleConfirmEliminate = () => {
    if (!selectedPlayer) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setShowConfirm(false);
    eliminatePlayer(selectedPlayer.id);
    setSelectedPlayer(null);
  };

  const handleCancelEliminate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConfirm(false);
    setSelectedPlayer(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0E0606', '#1A0808', '#0E0606']}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[styles.header, { paddingTop: topPadding + 8 }]}
      >
        <Text style={styles.headerTitle}>El Juicio</Text>
        <View style={styles.statsRow}>
          <StatBadge
            icon="people"
            label="Activos"
            value={alivePlayers.length}
            color={Colors.civilianLight}
          />
          <View style={styles.statDivider} />
          <StatBadge
            icon="skull"
            label="Eliminados"
            value={eliminatedPlayers.length}
            color={Colors.textMuted}
          />
        </View>
      </Animated.View>

      <FlatList
        data={players}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPadding + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          alivePlayers.length > 0 ? (
            <Text style={styles.sectionLabel}>JUGADORES ACTIVOS</Text>
          ) : null
        }
        renderItem={({ item, index }) => (
          <PlayerRow
            player={item}
            index={index}
            onPress={() => handleSelectPlayer(item)}
          />
        )}
        ListFooterComponent={
          eliminatedPlayers.length > 0 ? (
            <View style={styles.eliminatedSection}>
              <Text style={styles.sectionLabel}>ELIMINADOS</Text>
              {eliminatedPlayers.map((player, i) => (
                <PlayerRow key={player.id} player={player} index={i} onPress={() => {}} />
              ))}
            </View>
          ) : null
        }
      />

      <Animated.View
        entering={FadeIn.duration(400).delay(300)}
        style={[styles.instructionBanner, { bottom: bottomPadding + 20 }]}
      >
        <Ionicons name="information-circle" size={16} color={Colors.textMuted} />
        <Text style={styles.instructionText}>
          Toca un jugador activo para eliminarlo
        </Text>
      </Animated.View>

      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={handleCancelEliminate}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn.duration(300)} style={styles.confirmModal}>
            <LinearGradient
              colors={[Colors.surfaceElevated, Colors.surface]}
              style={styles.confirmGradient}
            >
              <View style={styles.confirmIcon}>
                <Ionicons name="skull" size={32} color={Colors.accentLight} />
              </View>
              <Text style={styles.confirmTitle}>Eliminar Jugador</Text>
              <Text style={styles.confirmName}>{selectedPlayer?.name}</Text>
              <Text style={styles.confirmSubtext}>
                ¿Estás seguro? Esta acción no se puede deshacer.
              </Text>
              <View style={styles.confirmButtons}>
                <Pressable
                  style={({ pressed }) => [styles.confirmCancelBtn, pressed && { opacity: 0.7 }]}
                  onPress={handleCancelEliminate}
                >
                  <Text style={styles.confirmCancelText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.confirmEliminateBtn, pressed && { opacity: 0.8 }]}
                  onPress={handleConfirmEliminate}
                >
                  <LinearGradient
                    colors={[Colors.accentLight, Colors.accent]}
                    style={styles.confirmEliminateBtnGradient}
                  >
                    <Text style={styles.confirmEliminateText}>Eliminar</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

function StatBadge({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.statBadge}>
      <Ionicons name={icon as any} size={14} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function PlayerRow({
  player,
  index,
  onPress,
}: {
  player: Player;
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!player.isAlive) return;
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 40)}
      layout={Layout.springify()}
      style={animStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!player.isAlive}
        style={[
          styles.playerRow,
          !player.isAlive && styles.playerRowEliminated,
        ]}
      >
        <View style={[styles.playerAvatar, !player.isAlive && styles.playerAvatarEliminated]}>
          {player.isAlive ? (
            <Text style={styles.playerAvatarText}>
              {player.name.charAt(0).toUpperCase()}
            </Text>
          ) : (
            <Ionicons name="skull-outline" size={18} color={Colors.eliminatedText} />
          )}
        </View>

        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, !player.isAlive && styles.playerNameEliminated]}>
            {player.name}
          </Text>
          {!player.isAlive && (
            <Text style={styles.eliminatedLabel}>Eliminado</Text>
          )}
        </View>

        {player.isAlive && (
          <View style={styles.playerAction}>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 14,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: Colors.gold,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  characterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  characterBadgeText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.gold,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 4,
  },
  eliminatedSection: {
    marginTop: 24,
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  playerRowEliminated: {
    backgroundColor: Colors.eliminated,
    borderColor: Colors.eliminated,
    opacity: 0.6,
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: Colors.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatarEliminated: {
    borderColor: Colors.eliminatedText,
    backgroundColor: Colors.eliminated,
  },
  playerAvatarText: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.gold,
  },
  playerInfo: {
    flex: 1,
    gap: 2,
  },
  playerName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  playerNameEliminated: {
    color: Colors.eliminatedText,
    textDecorationLine: 'line-through',
  },
  eliminatedLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  playerAction: {
    padding: 4,
  },
  instructionBanner: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  instructionText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  confirmModal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmGradient: {
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(180,30,30,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  confirmTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  confirmName: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: Colors.gold,
  },
  confirmSubtext: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  confirmCancelText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textSecondary,
  },
  confirmEliminateBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmEliminateBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmEliminateText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
});
