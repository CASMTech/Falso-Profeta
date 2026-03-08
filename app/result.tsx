import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
  FadeInDown,
  FadeInUp,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useGame } from '@/contexts/GameContext';

const { width } = Dimensions.get('window');

export default function ResultScreen() {
  const insets = useSafeAreaInsets();
  const { players, character, winner, resetGame } = useGame();
  const glowOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom;

  const impostorPlayer = players.find(p => p.isImpostor);
  const isImpostorWin = winner === 'impostor';

  useEffect(() => {
    const delay = isImpostorWin ? 200 : 100;
    Haptics.notificationAsync(
      isImpostorWin
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success,
    );

    iconScale.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 80 }));
    glowOpacity.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: iconScale.value }] }));

  const handlePlayAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetGame();
    router.replace('/setup');
  };

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetGame();
    router.replace('/');
  };

  const gradientColors = isImpostorWin
    ? (['#1A0606', '#2A0808', '#1A0606'] as const)
    : (['#061A10', '#082A14', '#061A10'] as const);

  const titleColor = isImpostorWin ? Colors.accentLight : Colors.successLight;
  const glowColor = isImpostorWin ? Colors.accent : Colors.success;

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFillObject} />

      <Animated.View style={[styles.glowCircle, { backgroundColor: glowColor }, glowStyle]} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPadding + 20, paddingBottom: bottomPadding + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(400)} style={styles.resultHeader}>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <LinearGradient
              colors={isImpostorWin ? [Colors.accentLight, Colors.accent] : [Colors.successLight, Colors.success]}
              style={styles.iconBg}
            >
              <Ionicons
                name={isImpostorWin ? 'warning' : 'shield-checkmark'}
                size={48}
                color="#FFFFFF"
              />
            </LinearGradient>
          </Animated.View>

          <Animated.Text entering={FadeInDown.duration(500).delay(200)} style={styles.resultLabel}>
            {isImpostorWin ? 'EL FALSO PROFETA HA TRIUNFADO' : 'LOS CREYENTES HAN VENCIDO'}
          </Animated.Text>

          <Animated.Text entering={FadeInDown.duration(500).delay(300)} style={[styles.resultTitle, { color: titleColor }]}>
            {isImpostorWin ? 'Victoria del Impostor' : 'Victoria de los Fieles'}
          </Animated.Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.impostorReveal}>
          <Text style={styles.revealLabel}>El Falso Profeta era</Text>
          <View style={styles.impostorCard}>
            <View style={styles.impostorAvatar}>
              <Text style={styles.impostorAvatarText}>
                {impostorPlayer?.name.charAt(0).toUpperCase() ?? '?'}
              </Text>
            </View>
            <Text style={styles.impostorName}>{impostorPlayer?.name ?? 'Desconocido'}</Text>
            <View style={[styles.impostorBadge, { backgroundColor: isImpostorWin ? Colors.accent : Colors.success }]}>
              <Text style={styles.impostorBadgeText}>
                {isImpostorWin ? 'Ganó' : 'Descubierto'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {character && (
          <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.characterCard}>
            <Text style={styles.characterCardLabel}>El personaje de esta partida</Text>
            <Text style={styles.characterCardName}>{character.name}</Text>
            <View style={styles.characterDivider} />
            <Text style={styles.characterCardDesc}>{character.description}</Text>
            <View style={styles.clueSection}>
              <Text style={styles.clueLabel}>La pista que tenía el impostor:</Text>
              <Text style={styles.clueValue}>"{character.impostorClue}"</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.duration(500).delay(600)} style={styles.playersSummary}>
          <Text style={styles.summaryTitle}>Resumen de jugadores</Text>
          {players.map((player, i) => (
            <View key={player.id} style={styles.summaryRow}>
              <View style={[
                styles.summaryAvatar,
                player.isImpostor && styles.summaryAvatarImpostor,
              ]}>
                <Text style={[styles.summaryAvatarText, player.isImpostor && styles.summaryAvatarTextImpostor]}>
                  {player.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.summaryName}>{player.name}</Text>
              <View style={[
                styles.summaryBadge,
                player.isImpostor
                  ? { backgroundColor: Colors.accent }
                  : player.isAlive
                    ? { backgroundColor: Colors.primaryDim }
                    : { backgroundColor: Colors.eliminated },
              ]}>
                <Text style={styles.summaryBadgeText}>
                  {player.isImpostor ? 'Impostor' : player.isAlive ? 'Sobrevivió' : 'Eliminado'}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(700)} style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [styles.playAgainBtn, pressed && styles.btnPressed]}
            onPress={handlePlayAgain}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDim]}
              style={styles.playAgainGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="refresh" size={20} color={Colors.text} />
              <Text style={styles.playAgainText}>Jugar de nuevo</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.homeBtn, pressed && { opacity: 0.7 }]}
            onPress={handleHome}
          >
            <Ionicons name="home-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.homeText}>Inicio</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  glowCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -80,
    alignSelf: 'center',
  },
  content: {
    paddingHorizontal: 24,
    gap: 24,
    alignItems: 'center',
  },
  resultHeader: {
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  iconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  resultTitle: {
    fontSize: 30,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    lineHeight: 36,
  },
  impostorReveal: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  revealLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  impostorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  impostorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  impostorAvatarText: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.accentLight,
  },
  impostorName: {
    flex: 1,
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  impostorBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  impostorBadgeText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFF',
  },
  characterCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.goldDim,
    gap: 10,
  },
  characterCardLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.goldDim,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  characterCardName: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.gold,
  },
  characterDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  characterCardDesc: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  clueSection: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 10,
    padding: 14,
    gap: 6,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  clueLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.accentLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clueValue: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  playersSummary: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryAvatarImpostor: {
    borderColor: Colors.accentLight,
    backgroundColor: 'rgba(180,30,30,0.15)',
  },
  summaryAvatarText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.textSecondary,
  },
  summaryAvatarTextImpostor: {
    color: Colors.accentLight,
  },
  summaryName: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  summaryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  summaryBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  playAgainBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  playAgainGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  playAgainText: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  homeBtn: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  homeText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
});
