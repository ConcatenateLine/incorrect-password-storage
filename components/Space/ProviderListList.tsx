import { useMemo, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import ProviderInterface from "@/interfaces/Provider.interface";
import AccountsList from "./AccountsList";

interface ProviderListListProps {
  providerList: ProviderInterface[];
  showPassword: (password: string) => string;
  deleteAccount: (id: string, username: string) => void;
  setEditingAccount: (account: any) => void;
}

const ProviderListList = ({
  providerList,
  showPassword,
  deleteAccount,
  setEditingAccount,
}: ProviderListListProps) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [measuredHeights, setMeasuredHeights] = useState<{
    [key: number]: number;
  }>({});
  const contentRefs = useRef<{ [key: number]: React.RefObject<View> }>({});

  // Memoize the card stack to prevent recreation on every render
  const cardStack = useMemo(() => {
    if (!providerList) return [];
    return providerList.map(() => {
      return {
        animatedHeight: new Animated.Value(60), // Start with header height
      };
    });
  }, [providerList]);

  // Create refs lazily to avoid unnecessary object creation
  const getContentRef = useCallback((index: number) => {
    if (!contentRefs.current[index]) {
      contentRefs.current[index] = { current: null };
    }
    return contentRefs.current[index];
  }, []);

  const handleCardPress = useCallback(
    (index: number) => {
      if (!cardStack[index]) {
        setSelectedCard(null);
        return;
      }

      if (selectedCard === index) {
        // Collapse animation with easing for smoother feel
        Animated.timing(cardStack[index].animatedHeight, {
          toValue: 60,
          duration: 120,
          useNativeDriver: false,
        }).start(() => {
          setSelectedCard(null);
        });
        return;
      }

      // Close previously selected card
      if (selectedCard !== null && cardStack[selectedCard]) {
        Animated.timing(cardStack[selectedCard].animatedHeight, {
          toValue: 60,
          duration: 120,
          useNativeDriver: false,
        }).start();
      }

      // Set selected card first to trigger render
      setSelectedCard(index);

      // If we have a measured height, animate to it immediately
      if (measuredHeights[index]) {
        Animated.timing(cardStack[index].animatedHeight, {
          toValue: measuredHeights[index],
          duration: 120,
          useNativeDriver: false,
        }).start();
      }
    },
    [cardStack, selectedCard, measuredHeights]
  );

  const handleContentLayout = useCallback(
    (index: number, event: any) => {
      const { height } = event.nativeEvent.layout;
      const totalHeight = height + 60; // Add header height

      // Only update if height actually changed to prevent unnecessary re-renders
      setMeasuredHeights((prev) => {
        if (prev[index] === totalHeight) return prev;
        return {
          ...prev,
          [index]: totalHeight,
        };
      });

      // If this card is currently selected, animate to the measured height
      if (selectedCard === index) {
        Animated.timing(cardStack[index].animatedHeight, {
          toValue: totalHeight,
          duration: 120,
          useNativeDriver: false,
        }).start();
      }
    },
    [selectedCard, cardStack]
  );

  // Memoize the render function to prevent unnecessary re-renders
  const renderCard = useCallback(
    (item: ProviderInterface, index: number) => {
      const contentRef = getContentRef(index);

      return (
        <Animated.View
          key={index}
          style={[
            styles.item,
            {
              overflow: "hidden",
              backgroundColor: item.color,
              zIndex: selectedCard === index ? 1000 : 1,
              height: cardStack[index].animatedHeight,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.itemContent}
            onPress={() => handleCardPress(index)}
            activeOpacity={0.7}
          >
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>
              {selectedCard === index ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {selectedCard === index && (
            <View
              ref={contentRef}
              style={{
                position: "absolute",
                top: 60,
                left: 0,
                right: 0,
                backgroundColor: item.color,
              }}
              onLayout={(event) => handleContentLayout(index, event)}
            >
              <AccountsList
                accountList={item.accounts}
                showPassword={showPassword}
                deleteAccount={deleteAccount}
                setEditingAccount={setEditingAccount}
              />
            </View>
          )}
        </Animated.View>
      );
    },
    [
      selectedCard,
      cardStack,
      handleCardPress,
      handleContentLayout,
      getContentRef,
      showPassword,
      deleteAccount,
      setEditingAccount,
    ]
  );

  return (
    <View style={styles.container}>
      {providerList?.map((item, index) => renderCard(item, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    width: "100%",
    paddingBottom: 40,
    paddingTop: 20,
  },
  item: {
    height: "auto",
    marginHorizontal: 5,
    paddingTop: 60,
    shadowColor: "#F7AF27",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 22,
    elevation: 5,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1,
    borderRadius: 8,
    position: "absolute",
    padding: 20,
    width: "100%",
  },
  itemText: {
    color: "#F7AF27",
    fontFamily: "TiltNeon",
    fontSize: 18,
  },
});

export default ProviderListList;
