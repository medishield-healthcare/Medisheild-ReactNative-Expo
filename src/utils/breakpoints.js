import { useWindowDimensions } from "react-native";

function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile:  width < 640,
    isTablet:  width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    // product grid columns
    cols: width < 480 ? 1 : width < 768 ? 2 : width < 1024 ? 3 : 4,
    px: width < 640 ? 16 : width < 1024 ? 24 : 40,
  };
}

export default useBreakpoint;