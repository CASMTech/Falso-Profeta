import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useGame } from '@/contexts/GameContext';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 340;

export default function RevealScreen() {
  const insets = useSafeAreaInsets();
  const { players, character, revealIndex, nextReveal, gamePhase } = useGame();
  const [hasPeeked, setHasPeeked] = useState(false);
  const cardFlip = useSharedValue(0);

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom;

  const currentPlayer = players[revealIndex];
  const isImpostor = currentPlayer?.isImpostor ?? false;
  const isLastPlayer = revealIndex >= players.length - 1;

  useEffect(() => {
    if (gamePhase === 'game') {
      router.replace('/game');
    }
  }, [gamePhase]);

  // Cada vez que cambia el jugador, resetear estado
  useEffect(() => {
    setHasPeeked(false);
    cardFlip.value = withTiming(0, { duration: 200 });
  }, [revealIndex]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${cardFlip.value * 180}deg` },
    ],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${cardFlip.value * 180 + 180}deg` },
    ],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
  }));

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    cardFlip.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = () => {
    cardFlip.value = withTiming(0, { duration: 350, easing: Easing.inOut(Easing.ease) });
    setHasPeeked(true);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nextReveal();
  };

  if (!currentPlayer || !character) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0E0606', '#1A0808', '#0E0606']} style={StyleSheet.absoluteFillObject} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0E0606', '#1A0808', '#0E0606']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
        <View style={styles.progressRow}>
          {players.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i < revealIndex && styles.progressDotDone,
                i === revealIndex && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.headerSubtitle}>
          Jugador {revealIndex + 1} de {players.length}
        </Text>
      </View>

      <View style={[styles.content, { paddingBottom: bottomPadding + 16 }]}>
        <Animated.Text entering={FadeIn.duration(400)} style={styles.playerName}>
          {currentPlayer.name}
        </Animated.Text>

        <Text style={styles.instruction}>
          {hasPeeked
            ? 'Pasa el teléfono al siguiente jugador'
            : 'Mantén presionado para ver tu rol'}
        </Text>

        {/* Card container con Pressable encima de toda la carta */}
        <View style={styles.cardWrapper}>
          <Animated.View style={[styles.cardFace, frontStyle]}>
            <LinearGradient
              colors={[Colors.surface, Colors.surfaceElevated]}
              style={styles.cardGradient}
            >
              <View style={styles.cardHidden}>
                <View style={styles.cardCrossContainer}>
                  <Text style={styles.cardCrossText}>☩</Text>
                </View>
                <Text style={styles.cardTapText}>Mantén presionado</Text>
                <View style={styles.holdHint}>
                  <Ionicons name="finger-print" size={16} color={Colors.textMuted} />
                  <Text style={styles.holdHintText}>Suelta para cerrar</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[styles.cardFace, backStyle]}>
            <LinearGradient
              colors={
                isImpostor
                  ? [Colors.accent, '#6A0F0F']
                  : ['#0F2A4A', Colors.civilian]
              }
              style={styles.cardGradient}
            >
              <View style={styles.cardRevealed}>
                {isImpostor ? (
                  <>
                    <View style={styles.roleIconContainer}>
                      <Ionicons name="warning" size={36} color={Colors.impostorLight} />
                    </View>
                    <Text style={styles.roleLabelImpostor}>FALSO PROFETA</Text>
                    <View style={styles.divider} />
                    <Text style={styles.clueTitle}>Tu única pista:</Text>
                    <Text style={styles.clueText}>{character.impostorClue}</Text>
                    <View style={styles.warningBox}>
                      <Ionicons name="eye-off" size={14} color={Colors.impostorLight} />
                      <Text style={styles.warningText}>No reveles que eres el impostor</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.roleIconContainer}>
                      <Ionicons name="shield-checkmark" size={36} color={Colors.civilianLight} />
                    </View>
                    <Text style={styles.roleLabelCivilian}>CREYENTE</Text>
                    <Text style={styles.characterName}>{character.name}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.characterDesc}>{character.description}</Text>
                  </>
                )}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Pressable transparente que cubre toda la carta */}
          <Pressable
            style={styles.cardPressable}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          />
        </View>

        {hasPeeked ? (
          <Animated.View entering={FadeIn.duration(400)} style={styles.nextContainer}>
            <Pressable
              style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
              onPress={handleNext}
            >
              <LinearGradient
                colors={[Colors.goldDim, '#5A3D10']}
                style={styles.nextButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.nextButtonText}>
                  {isLastPlayer ? 'Comenzar el Juicio' : 'Siguiente jugador'}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.gold} />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        ) : (
          <View style={styles.nextContainerPlaceholder} />
        )}
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  progressDotDone: {
    backgroundColor: Colors.goldDim,
  },
  progressDotActive: {
    backgroundColor: Colors.gold,
    width: 20,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 20,
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: Colors.gold,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  cardWrapper: {
    width: width - 48,
    height: CARD_HEIGHT,
    position: 'relative',
  },
  cardFace: {
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardGradient: {
    flex: 1,
    padding: 24,
  },
  cardHidden: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  cardCrossContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCrossText: {
    fontSize: 40,
    color: Colors.textMuted,
  },
  cardTapText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  holdHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.6,
  },
  holdHintText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  cardPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  cardRevealed: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  roleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleLabelImpostor: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.impostorLight,
    letterSpacing: 3,
  },
  roleLabelCivilian: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.civilianLight,
    letterSpacing: 3,
  },
  characterName: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  characterDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  clueTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  clueText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  warningBox: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.impostorLight,
  },
  nextContainer: {
    width: '100%',
  },
  nextContainerPlaceholder: {
    width: '100%',
    height: 56,
  },
  nextButton: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.goldDim,
  },
  nextButtonPressed: {
    opacity: 0.8,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.gold,
  },
});
