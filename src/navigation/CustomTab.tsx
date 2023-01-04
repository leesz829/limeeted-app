import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as React from 'react';
import { Color } from 'assets/styles/Color';
import TabIcon from 'component/TabIcon';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { BottomTabDescriptorMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types';

const CustomTab = ({
  state,
  descriptors,
  navigation,
}: {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: any;
}) => {
  return (
    <View style={styles.tabContainer} key={'CustomTab'}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        if (options.tabBarShowLabel) {
          console.log(route.key);
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              style={styles.tab}
              testID={options.tabBarTestID}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <TabIcon name={route.name} isFocused={isFocused} />
              <Text style={styles.tabLabel}>{label}</Text>
            </TouchableOpacity>
          );
        }

        return null;
      })}
    </View>
  );
};

export default CustomTab;

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabContainer: {
    borderTopColor: Color.grayEEEE,
    borderTopWidth: 2,
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 56,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontFamily: 'RIDIBatang',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 'bold',
  },
});
