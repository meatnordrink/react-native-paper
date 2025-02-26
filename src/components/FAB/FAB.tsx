import * as React from 'react';
import {
  Animated,
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  AccessibilityState,
} from 'react-native';
import ActivityIndicator from '../ActivityIndicator';
import Surface from '../Surface';
import CrossFadeIcon from '../CrossFadeIcon';
import Icon, { IconSource } from '../Icon';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { withTheme } from '../../core/theming';
import { getExtendedFabStyle, getFABColors, getFabStyle } from './utils';
import type { $RemoveChildren, Theme } from '../../types';

type FABSize = 'small' | 'medium' | 'large';

type FABMode = 'flat' | 'elevated';

type Props = $RemoveChildren<typeof Surface> & {
  /**
   * Icon to display for the `FAB`.
   */
  icon: IconSource;
  /**
   * Optional label for extended `FAB`.
   */
  label?: string;
  /**
   * Make the label text uppercased.
   */
  uppercase?: boolean;
  /**
   * Accessibility label for the FAB. This is read by the screen reader when the user taps the FAB.
   * Uses `label` by default if specified.
   */
  accessibilityLabel?: string;
  /**
   * Accessibility state for the FAB. This is read by the screen reader when the user taps the FAB.
   */
  accessibilityState?: AccessibilityState;
  /**
   * Whether an icon change is animated.
   */
  animated?: boolean;
  /**
   *  @deprecated Deprecated in v.3x - use prop size="small".
   *
   *  Whether FAB is mini-sized, used to create visual continuity with other elements. This has no effect if `label` is specified.
   */
  small?: boolean;
  /**
   * Custom color for the icon and label of the `FAB`.
   */
  color?: string;
  /**
   * Whether `FAB` is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Whether `FAB` is currently visible.
   */
  visible?: boolean;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => void;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Size of the `FAB`.
   * - `small` - FAB with small height (40).
   * - `medium` - FAB with default medium height (56).
   * - `large` - FAB with large height (96).
   */
  size?: FABSize;
  /**
   * @supported Available in v5.x
   *
   * Custom size for the `FAB`. This prop takes precedence over size prop
   */
  customSize?: number;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Mode of the `FAB`. You can change the mode to adjust the the shadow:
   * - `flat` - button without a shadow.
   * - `elevated` - button with a shadow.
   */
  mode?: FABMode;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Color mappings variant for combinations of container and icon colors.
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
  testID?: string;
};

/**
 * A floating action button represents the primary action in an application.
 * <div class="screenshots">
 *   <img class="small" src="screenshots/fab-1.png" />
 *   <img class="small" src="screenshots/fab-2.png" />
 *   <img class="small" src="screenshots/fab-3.png" />
 *   <img class="small" src="screenshots/fab-4.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { FAB } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <FAB
 *     icon="plus"
 *     style={styles.fab}
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 *
 * const styles = StyleSheet.create({
 *   fab: {
 *     position: 'absolute',
 *     margin: 16,
 *     right: 0,
 *     bottom: 0,
 *   },
 * })
 *
 * export default MyComponent;
 * ```
 */
const FAB = ({
  icon,
  label,
  accessibilityLabel = label,
  accessibilityState,
  animated = true,
  color: customColor,
  disabled,
  onPress,
  onLongPress,
  theme,
  style,
  visible = true,
  uppercase = !theme.isV3,
  loading,
  testID,
  size = 'medium',
  customSize,
  mode = 'elevated',
  variant = 'primary',
  ...rest
}: Props) => {
  const { current: visibility } = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0)
  );
  const { isV3, animation } = theme;
  const { scale } = animation;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(visibility, {
        toValue: 1,
        duration: 200 * scale,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(visibility, {
        toValue: 0,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, scale, visibility]);

  const IconComponent = animated ? CrossFadeIcon : Icon;

  const { backgroundColor, foregroundColor, rippleColor } = getFABColors({
    theme,
    variant,
    disabled,
    customColor,
    style,
  });

  const isLargeSize = size === 'large';
  const isFlatMode = mode === 'flat';
  const iconSize = isLargeSize ? 36 : 24;
  const loadingIndicatorSize = isLargeSize ? 24 : 18;

  const fabStyle = getFabStyle({ customSize, size, theme });
  const extendedStyle = getExtendedFabStyle({ customSize, theme });
  const textStyle = {
    color: foregroundColor,
    ...(isV3 ? theme.typescale.labelLarge : theme.fonts.medium),
  };
  const shapeStyle = { borderRadius: fabStyle.borderRadius };

  const containerStyles = [
    !isV3 && styles.elevated,
    !isV3 && disabled && styles.disabled,
    shapeStyle,
  ];
  const md3Elevation = isFlatMode || disabled ? 0 : 3;

  return (
    <Surface
      {...rest}
      style={
        [
          {
            backgroundColor,
            opacity: visibility,
            transform: [
              {
                scale: visibility,
              },
            ],
          },
          containerStyles,
          style,
        ] as StyleProp<ViewStyle>
      }
      pointerEvents={visible ? 'auto' : 'none'}
      {...(isV3 && { elevation: md3Elevation })}
    >
      <TouchableRipple
        borderless
        onPress={onPress}
        onLongPress={onLongPress}
        rippleColor={rippleColor}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ ...accessibilityState, disabled }}
        style={shapeStyle}
        testID={testID}
      >
        <View
          style={[styles.content, label ? extendedStyle : fabStyle]}
          pointerEvents="none"
        >
          {icon && loading !== true ? (
            <IconComponent
              source={icon}
              size={customSize ? customSize / 2 : iconSize}
              color={foregroundColor}
            />
          ) : null}
          {loading ? (
            <ActivityIndicator
              size={customSize ? customSize / 2 : loadingIndicatorSize}
              color={foregroundColor}
            />
          ) : null}
          {label ? (
            <Text
              variant="labelLarge"
              selectable={false}
              style={[
                styles.label,
                uppercase && styles.uppercaseLabel,
                textStyle,
              ]}
            >
              {label}
            </Text>
          ) : null}
        </View>
      </TouchableRipple>
    </Surface>
  );
};

const styles = StyleSheet.create({
  elevated: {
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginHorizontal: 8,
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
  disabled: {
    elevation: 0,
  },
});

export default withTheme(FAB);

// @component-docs ignore-next-line
const FABWithTheme = withTheme(FAB);
// @component-docs ignore-next-line
export { FABWithTheme as FAB };
