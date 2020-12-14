import React, { FC, ReactElement } from "react";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

import Item from "./Item";
import { COL, Positions, SIZE } from "./Config";
import { useSharedValue } from "./Animations";
interface ListProps {
  children: ReactElement<{ id: string }>[];
}

const List: FC<ListProps> = ({ children }) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const positions = useSharedValue<Positions>(
    Object.assign(
      {},
      ...children.map((child, index) => ({ [child.props.id]: index }))
    )
  );
  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      scrollY.value = y;
    },
  });
  const contentContainerStyle = {
    height: Math.ceil(children.length / COL) * SIZE,
  };
  return (
    <Animated.ScrollView
      {...{
        ref: scrollViewRef,
        contentContainerStyle,
        onScroll,
        showsVerticalScrollIndicator: false,
        bounces: false,
        scrollEventThrottle: 16,
      }}>
      {children.map((child) => {
        return (
          <Item
            {...{
              scrollViewRef,
              key: child.props.id,
              id: child.props.id,
              positions,
              scrollY,
            }}>
            {child}
          </Item>
        );
      })}
    </Animated.ScrollView>
  );
};

export default List;
