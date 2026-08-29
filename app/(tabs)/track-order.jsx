import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import API from "@/api/axios";

import C from "@/utils/theme";

import WebHeader from "components/Header/header.web";
import Footer from "components/Footer/Footer";


// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PRIMARY = C.primary || "#0f766e";

const FILTERS = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "Processing",
    label: "Processing",
  },
  {
    key: "Shipped",
    label: "Shipped",
  },
  {
    key: "Delivered",
    label: "Delivered",
  },
];


// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE
// ─────────────────────────────────────────────────────────────────────────────

function useResponsive() {
  const { width } = useWindowDimensions();

  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    horizontalPadding:
      width < 640
        ? 16
        : width < 1024
          ? 28
          : 44,
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const formatPrice = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};


const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const getProductImage = (product) => {
  return (
    product?.thumbnail_url ||
    product?.media_gallery_entries?.[0]?.file ||
    null
  );
};


const getOrderTotal = (order) => {
  return Number(order?.paymentIntent?.amount || 0);
};


const getItemCount = (order) => {
  return (order?.products || []).reduce(
    (total, item) =>
      total + Number(item?.count || 1),
    0
  );
};


const getStatus = (status) => {
  const value = String(status || "").toLowerCase();

  if (value.includes("cancel")) {
    return {
      label: "Cancelled",
      color: "#dc2626",
      bg: "#fef2f2",
      step: 0,
      icon: "close-circle-outline",
    };
  }

  if (value.includes("deliver")) {
    return {
      label: "Delivered",
      color: "#15803d",
      bg: "#f0fdf4",
      step: 4,
      icon: "checkmark-circle-outline",
    };
  }

  if (value.includes("ship")) {
    return {
      label: "Shipped",
      color: "#0369a1",
      bg: "#eff6ff",
      step: 3,
      icon: "car-outline",
    };
  }

  if (value.includes("process")) {
    return {
      label: "Processing",
      color: "#b45309",
      bg: "#fffbeb",
      step: 2,
      icon: "cube-outline",
    };
  }

  return {
    label: status || "Placed",
    color: PRIMARY,
    bg: "#f0fdfa",
    step: 1,
    icon: "bag-check-outline",
  };
};


// ─────────────────────────────────────────────────────────────────────────────
// ORDER PROGRESS
// ─────────────────────────────────────────────────────────────────────────────

function OrderProgress({ status }) {
  const current = getStatus(status);

  const steps = [
    {
      label: "Placed",
      step: 1,
    },
    {
      label: "Processing",
      step: 2,
    },
    {
      label: "Shipped",
      step: 3,
    },
    {
      label: "Delivered",
      step: 4,
    },
  ];

  if (current.step === 0) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 15,
          borderRadius: 12,
          backgroundColor: "#fef2f2",
        }}
      >
        <Ionicons
          name="close-circle-outline"
          size={19}
          color="#dc2626"
        />

        <Text
          style={{
            marginLeft: 8,
            fontSize: 11,
            fontWeight: "800",
            color: "#991b1b",
          }}
        >
          This order has been cancelled
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        paddingTop: 6,
        paddingBottom: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {steps.map((item, index) => {
          const completed =
            item.step <= current.step;

          const active =
            item.step === current.step;

          const last =
            index === steps.length - 1;

          return (
            <React.Fragment key={item.label}>
              <View
                style={{
                  alignItems: "center",
                  width: 68,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor:
                      completed
                        ? PRIMARY
                        : "#fff",

                    borderWidth:
                      completed ? 0 : 1,

                    borderColor:
                      completed
                        ? PRIMARY
                        : "#d7dee0",
                  }}
                >
                  {completed ? (
                    <Ionicons
                      name="checkmark"
                      size={13}
                      color="#fff"
                    />
                  ) : (
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor:
                          "#cbd5e1",
                      }}
                    />
                  )}
                </View>

                <Text
                  style={{
                    marginTop: 7,
                    fontSize: 9,
                    fontWeight:
                      active ? "900" : "600",
                    color:
                      active
                        ? "#111827"
                        : completed
                          ? "#475569"
                          : "#94a3b8",
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Text>
              </View>

              {!last && (
                <View
                  style={{
                    flex: 1,
                    height: 1.5,
                    backgroundColor:
                      item.step < current.step
                        ? PRIMARY
                        : "#e2e8f0",
                    marginTop: -19,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT PREVIEW
// ─────────────────────────────────────────────────────────────────────────────

function ProductPreview({
  products,
  isMobile,
}) {
  const firstProducts =
    products?.slice(0, 3) || [];

  const remaining =
    Math.max(
      0,
      (products?.length || 0) - 3
    );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {firstProducts.map((item, index) => {
        const image = getProductImage(
          item?.product
        );

        return (
          <View
            key={
              item?._id ||
              `${index}`
            }
            style={{
              width: isMobile ? 58 : 64,
              height: isMobile ? 58 : 64,
              borderRadius: 10,
              backgroundColor: "#f7f7f5",
              borderWidth: 1,
              borderColor: "#e9eceb",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",

              marginLeft:
                index === 0 ? 0 : -8,

              zIndex:
                firstProducts.length -
                index,
            }}
          >
            {image ? (
              <Image
                source={{
                  uri: image,
                }}
                resizeMode="contain"
                style={{
                  width: "86%",
                  height: "86%",
                }}
              />
            ) : (
              <Ionicons
                name="image-outline"
                size={20}
                color="#cbd5e1"
              />
            )}
          </View>
        );
      })}

      {remaining > 0 && (
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 10,
            marginLeft: -8,
            backgroundColor: "#111827",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 11,
              fontWeight: "900",
            }}
          >
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT ROW
// ─────────────────────────────────────────────────────────────────────────────

function ProductRow({ item }) {
  const product = item?.product;

  const image = getProductImage(product);

  const quantity =
    Number(item?.count || 1);

  const price =
    Number(item?.price || 0);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#edf0ef",
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 10,
          backgroundColor: "#f7f7f5",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {image ? (
          <Image
            source={{
              uri: image,
            }}
            resizeMode="contain"
            style={{
              width: "88%",
              height: "88%",
            }}
          />
        ) : (
          <Ionicons
            name="image-outline"
            size={22}
            color="#cbd5e1"
          />
        )}
      </View>

      <View
        style={{
          flex: 1,
          marginLeft: 13,
          paddingRight: 12,
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            fontSize: 12,
            lineHeight: 17,
            fontWeight: "800",
            color: "#111827",
          }}
        >
          {product?.name || "Product"}
        </Text>

        {product?.manufacturer && (
          <Text
            numberOfLines={1}
            style={{
              marginTop: 4,
              fontSize: 10,
              color: "#64748b",
            }}
          >
            {product.manufacturer}
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 7,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#64748b",
            }}
          >
            Qty {quantity}
          </Text>

          {item?.variant && (
            <>
              <View
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor:
                    "#cbd5e1",
                  marginHorizontal: 7,
                }}
              />

              <Text
                numberOfLines={1}
                style={{
                  flexShrink: 1,
                  fontSize: 9,
                  color: "#94a3b8",
                }}
              >
                {item.variant}
              </Text>
            </>
          )}
        </View>
      </View>

      <Text
        style={{
          fontSize: 13,
          fontWeight: "900",
          color: "#111827",
        }}
      >
        {formatPrice(price * quantity)}
      </Text>
    </View>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// INFO ROW
// ─────────────────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  title,
  children,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#edf0ef",
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          backgroundColor: "#f4f7f6",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={icon}
          size={16}
          color="#111827"
        />
      </View>

      <View
        style={{
          flex: 1,
          marginLeft: 11,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: "800",
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Text>

        <View
          style={{
            marginTop: 5,
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ORDER DETAILS
// ─────────────────────────────────────────────────────────────────────────────

function OrderDetails({
  order,
  isMobile,
}) {
  const products =
    order?.products || [];

  const payment =
    order?.paymentIntent || {};

  const shipping =
    order?.shippingAddress || {};

  const subtotal = products.reduce(
    (total, item) => {
      return (
        total +
        Number(item?.price || 0) *
          Number(item?.count || 1)
      );
    },
    0
  );

  const total =
    Number(payment?.amount || 0);

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: "#e8eceb",
        backgroundColor: "#fff",
      }}
    >
      {/* STATUS */}

      <View
        style={{
          paddingHorizontal:
            isMobile ? 16 : 22,
          paddingTop: 18,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "900",
                color: "#111827",
              }}
            >
              Delivery status
            </Text>

            <Text
              style={{
                marginTop: 3,
                fontSize: 10,
                color: "#94a3b8",
              }}
            >
              Your order journey
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor:
                  getStatus(order?.orderStatus)
                    .color,
              }}
            />

            <Text
              style={{
                fontSize: 10,
                fontWeight: "800",
                color:
                  getStatus(
                    order?.orderStatus
                  ).color,
              }}
            >
              {getStatus(
                order?.orderStatus
              ).label}
            </Text>
          </View>
        </View>

        <OrderProgress
          status={order?.orderStatus}
        />
      </View>

      {/* DETAILS GRID */}

      <View
        style={{
          flexDirection:
            isMobile
              ? "column"
              : "row",
          borderTopWidth: 1,
          borderTopColor: "#edf0ef",
        }}
      >
        {/* PRODUCTS */}

        <View
          style={{
            flex: 1.4,
            paddingHorizontal:
              isMobile ? 16 : 22,
          }}
        >
          <View
            style={{
              paddingTop: 18,
              paddingBottom: 3,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "900",
                color: "#111827",
              }}
            >
              Items
            </Text>

            <Text
              style={{
                marginTop: 3,
                fontSize: 10,
                color: "#94a3b8",
              }}
            >
              {getItemCount(order)}{" "}
              {getItemCount(order) === 1
                ? "item"
                : "items"}{" "}
              in this order
            </Text>
          </View>

          {products.map(
            (item, index) => (
              <ProductRow
                key={
                  item?._id ||
                  `${order?._id}-${index}`
                }
                item={item}
              />
            )
          )}
        </View>

        {/* RIGHT */}

        <View
          style={{
            flex: 1,
            paddingHorizontal:
              isMobile ? 16 : 22,
            paddingBottom:
              isMobile ? 18 : 22,
          }}
        >
          {/* DELIVERY */}

          <InfoRow
            icon="location-outline"
            title="Deliver to"
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                color: "#334155",
              }}
            >
              {shipping?.name ||
                "Customer"}
            </Text>

            <Text
              style={{
                marginTop: 3,
                fontSize: 10,
                lineHeight: 16,
                color: "#64748b",
              }}
            >
              {shipping?.address || ""}
              {"\n"}
              {[
                shipping?.city,
                shipping?.state,
                shipping?.pincode,
              ]
                .filter(Boolean)
                .join(", ")}
            </Text>

            {shipping?.mobile && (
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 9,
                  color: "#94a3b8",
                }}
              >
                {shipping.mobile}
              </Text>
            )}
          </InfoRow>

          {/* PAYMENT */}

          <InfoRow
            icon="card-outline"
            title="Payment"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent:
                  "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: "#64748b",
                }}
              >
                Amount paid
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "900",
                  color: "#111827",
                }}
              >
                {formatPrice(total)}
              </Text>
            </View>

            <Text
              numberOfLines={1}
              style={{
                marginTop: 4,
                fontSize: 9,
                color: "#94a3b8",
              }}
            >
              {payment?.currency || "INR"}
              {" • "}
              {payment?.id || "Payment processed"}
            </Text>
          </InfoRow>

          {/* SUMMARY */}

          <InfoRow
            icon="receipt-outline"
            title="Summary"
          >
            <View
              style={{
                gap: 7,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent:
                    "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                  }}
                >
                  Subtotal
                </Text>

                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: "#334155",
                  }}
                >
                  {formatPrice(subtotal)}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent:
                    "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                  }}
                >
                  Shipping
                </Text>

                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "800",
                    color: "#15803d",
                  }}
                >
                  {Number(
                    payment?.shipping || 0
                  ) === 0
                    ? "FREE"
                    : formatPrice(
                        payment.shipping
                      )}
                </Text>
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor:
                    "#edf0ef",
                  marginVertical: 2,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent:
                    "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "900",
                    color: "#111827",
                  }}
                >
                  Total
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "900",
                    color: PRIMARY,
                  }}
                >
                  {formatPrice(total)}
                </Text>
              </View>
            </View>
          </InfoRow>
        </View>
      </View>

      {/* FOOTER */}

      <View
        style={{
          paddingHorizontal:
            isMobile ? 16 : 22,
          paddingVertical: 13,
          backgroundColor: "#fafbfa",
          flexDirection:
            isMobile
              ? "column"
              : "row",
          alignItems:
            isMobile
              ? "flex-start"
              : "center",
          justifyContent:
            "space-between",
          gap: 6,
        }}
      >
        <Text
          style={{
            fontSize: 9,
            color: "#94a3b8",
          }}
        >
          Ordered on{" "}
          {formatDate(order?.createdAt)}
        </Text>

        {order?.couponCodeApplied && (
          <Text
            style={{
              fontSize: 9,
              color: "#15803d",
              fontWeight: "700",
            }}
          >
            Coupon applied
          </Text>
        )}
      </View>
    </View>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ORDER CARD
// ─────────────────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  isMobile,
  initiallyOpen = false,
}) {
  const [open, setOpen] =
    useState(initiallyOpen);

  const status = getStatus(
    order?.orderStatus
  );

  const products =
    order?.products || [];

  const total =
    getOrderTotal(order);

  const itemCount =
    getItemCount(order);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: open
          ? "#dfe6e4"
          : "#e8eceb",
        borderRadius: 14,
        overflow: "hidden",

        ...(Platform.OS === "web"
          ? {
              boxShadow: open
                ? "0 8px 30px rgba(0,0,0,0.07)"
                : "0 2px 12px rgba(0,0,0,0.035)",
            }
          : {
              elevation: open ? 2 : 1,
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 8,
              shadowOffset: {
                width: 0,
                height: 2,
              },
            }),
      }}
    >
      {/* ─────────────────────────────────
          COMPACT HEADER
      ───────────────────────────────── */}

      <Pressable
        onPress={() =>
          setOpen((value) => !value)
        }
        style={{
          padding:
            isMobile ? 15 : 18,
        }}
      >
        {/* TOP META */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              color: "#94a3b8",
              letterSpacing: 0.3,
            }}
          >
            ORDER #
            {String(
              order?._id || ""
            ).slice(-8).toUpperCase()}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor:
                status.bg,
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 20,
            }}
          >
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 3,
                backgroundColor:
                  status.color,
              }}
            />

            <Text
              style={{
                fontSize: 9,
                fontWeight: "900",
                color: status.color,
              }}
            >
              {status.label}
            </Text>
          </View>
        </View>

        {/* MAIN */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <ProductPreview
            products={products}
            isMobile={isMobile}
          />

          <View
            style={{
              flex: 1,
              marginLeft: 14,
              minWidth: 0,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                fontSize: 13,
                lineHeight: 18,
                fontWeight: "800",
                color: "#111827",
              }}
            >
              {products?.[0]?.product?.name ||
                "Order items"}
            </Text>

            {products.length > 1 && (
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 10,
                  color: "#64748b",
                }}
              >
                +{products.length - 1}{" "}
                more{" "}
                {products.length - 1 === 1
                  ? "item"
                  : "items"}
              </Text>
            )}

            <Text
              style={{
                marginTop: 6,
                fontSize: 9,
                color: "#94a3b8",
              }}
            >
              {formatDate(
                order?.createdAt
              )}
              {" • "}
              {itemCount}{" "}
              {itemCount === 1
                ? "item"
                : "items"}
            </Text>
          </View>

          <View
            style={{
              alignItems: "flex-end",
              marginLeft: 8,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "900",
                color: "#111827",
              }}
            >
              {formatPrice(total)}
            </Text>

            <View
              style={{
                marginTop: 7,
                width: 27,
                height: 27,
                borderRadius: 14,
                backgroundColor: "#f5f6f5",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={
                  open
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={14}
                color="#111827"
              />
            </View>
          </View>
        </View>

        {/* MINI PROGRESS */}

        {!open && (
          <View
            style={{
              marginTop: 17,
            }}
          >
            <OrderProgress
              status={order?.orderStatus}
            />
          </View>
        )}
      </Pressable>

      {/* DETAILS */}

      {open && (
        <OrderDetails
          order={order}
          isMobile={isMobile}
        />
      )}
    </View>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

function EmptyOrders({ onShop }) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 90,
        paddingHorizontal: 25,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: "#f5f6f5",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 22,
        }}
      >
        <Ionicons
          name="bag-outline"
          size={30}
          color="#111827"
        />
      </View>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "900",
          color: "#111827",
          letterSpacing: -0.5,
        }}
      >
        No orders yet
      </Text>

      <Text
        style={{
          maxWidth: 390,
          marginTop: 8,
          fontSize: 12,
          lineHeight: 19,
          color: "#64748b",
          textAlign: "center",
        }}
      >
        When you place your first order,
        it will appear here with all its
        tracking and delivery details.
      </Text>

      <Pressable
        onPress={onShop}
        style={({ pressed }) => ({
          marginTop: 24,
          minWidth: 160,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111827",
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 4,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 11,
            fontWeight: "900",
            letterSpacing: 0.7,
          }}
        >
          START SHOPPING
        </Text>
      </Pressable>
    </View>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 90,
        paddingHorizontal: 25,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: "#fef2f2",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={28}
          color="#dc2626"
        />
      </View>

      <Text
        style={{
          fontSize: 21,
          fontWeight: "900",
          color: "#111827",
        }}
      >
        Something went wrong
      </Text>

      <Text
        style={{
          maxWidth: 420,
          marginTop: 8,
          fontSize: 12,
          lineHeight: 19,
          color: "#64748b",
          textAlign: "center",
        }}
      >
        {message ||
          "We couldn't load your orders. Please try again."}
      </Text>

      <Pressable
        onPress={onRetry}
        style={({ pressed }) => ({
          marginTop: 22,
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 4,
          backgroundColor: "#111827",
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Ionicons
          name="refresh-outline"
          size={15}
          color="#fff"
        />

        <Text
          style={{
            color: "#fff",
            fontSize: 11,
            fontWeight: "900",
          }}
        >
          TRY AGAIN
        </Text>
      </Pressable>
    </View>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// LOADING
// ─────────────────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <View
      style={{
        minHeight: 500,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator
        size="small"
        color={PRIMARY}
      />

      <Text
        style={{
          marginTop: 12,
          fontSize: 10,
          color: "#94a3b8",
          fontWeight: "700",
        }}
      >
        Loading orders
      </Text>
    </View>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// FILTER BAR
// ─────────────────────────────────────────────────────────────────────────────

function FilterBar({
  active,
  onChange,
  counts,
  isMobile,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 7,
        paddingRight: 10,
      }}
    >
      {FILTERS.map((filter) => {
        const selected =
          active === filter.key;

        return (
          <Pressable
            key={filter.key}
            onPress={() =>
              onChange(filter.key)
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,

              paddingHorizontal:
                isMobile ? 13 : 15,

              paddingVertical: 9,

              borderRadius: 4,

              backgroundColor:
                selected
                  ? "#111827"
                  : "#fff",

              borderWidth: 1,

              borderColor:
                selected
                  ? "#111827"
                  : "#e2e8e7",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "800",
                color: selected
                  ? "#fff"
                  : "#475569",
              }}
            >
              {filter.label}
            </Text>

            <Text
              style={{
                fontSize: 9,
                fontWeight: "900",
                color: selected
                  ? "#cbd5e1"
                  : "#94a3b8",
              }}
            >
              {counts[filter.key] || 0}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// TRACK ORDER
// ─────────────────────────────────────────────────────────────────────────────

function TrackOrder() {
  const router = useRouter();

  const {
    isMobile,
    horizontalPadding,
  } = useResponsive();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [activeFilter, setActiveFilter] =
    useState("all");


  // ─────────────────────────────────────────
  // FETCH ORDERS
  // ─────────────────────────────────────────

  const fetchOrders = useCallback(
    async (isRefresh = false) => {
      try {
        if (!isRefresh) {
          setLoading(true);
        }

        setError(null);

        const response =
          await API.get(
            "/user/get-orders"
          );

        console.log(
          "ORDERS API RESPONSE:",
          response?.data
        );

        const data =
          Array.isArray(
            response?.data?.data
          )
            ? response.data.data
            : [];

        console.log(
          "ORDERS:",
          data
        );

        setOrders(data);
      } catch (err) {
        console.log(
          "GET ORDERS ERROR:",
          err?.response?.data ||
            err?.message ||
            err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to fetch your orders right now."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  // ─────────────────────────────────────────
  // INITIAL
  // ─────────────────────────────────────────

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  // ─────────────────────────────────────────
  // FILTERED ORDERS
  // ─────────────────────────────────────────

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") {
      return orders;
    }

    return orders.filter((order) => {
      const status =
        getStatus(
          order?.orderStatus
        ).label;

      return status === activeFilter;
    });
  }, [
    orders,
    activeFilter,
  ]);


  // ─────────────────────────────────────────
  // COUNTS
  // ─────────────────────────────────────────

  const counts = useMemo(() => {
    return {
      all: orders.length,

      Processing: orders.filter(
        (order) =>
          getStatus(
            order?.orderStatus
          ).label === "Processing"
      ).length,

      Shipped: orders.filter(
        (order) =>
          getStatus(
            order?.orderStatus
          ).label === "Shipped"
      ).length,

      Delivered: orders.filter(
        (order) =>
          getStatus(
            order?.orderStatus
          ).label === "Delivered"
      ).length,
    };
  }, [orders]);


  // ─────────────────────────────────────────
  // REFRESH
  // ─────────────────────────────────────────

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(true);
  };


  // ─────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        {Platform.OS === "web" && (
          <WebHeader />
        )}

        <LoadingState />
      </SafeAreaView>
    );
  }


  // ─────────────────────────────────────────
  // PAGE
  // ─────────────────────────────────────────

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {Platform.OS === "web" && (
        <WebHeader />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          Platform.OS !== "web" ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={PRIMARY}
            />
          ) : undefined
        }
        contentContainerStyle={{
        //   paddingBottom: 70,
        }}
      >
        {/* ───────────────────────────────
            PAGE HEADER
        ─────────────────────────────── */}

        <View
          style={{
            width: "100%",
            maxWidth: 1200,
            alignSelf: "center",
            paddingHorizontal:
              horizontalPadding,
            paddingTop:
              isMobile ? 28 : 46,
            paddingBottom:
              isMobile ? 23 : 34,
          }}
        >
          {/* BREADCRUMB */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 24,
            }}
          >
            <Pressable
              onPress={() =>
                router.push("/")
              }
            >
              <Text
                style={{
                  fontSize: 10,
                  color: "#64748b",
                  fontWeight: "700",
                }}
              >
                Home
              </Text>
            </Pressable>

            <Ionicons
              name="chevron-forward"
              size={10}
              color="#cbd5e1"
            />

            <Text
              style={{
                fontSize: 10,
                color: "#111827",
                fontWeight: "800",
              }}
            >
              Orders
            </Text>
          </View>


          {/* TITLE ROW */}

          <View
            style={{
              flexDirection:
                isMobile
                  ? "column"
                  : "row",
              alignItems:
                isMobile
                  ? "flex-start"
                  : "flex-end",
              justifyContent:
                "space-between",
              gap: 18,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize:
                    isMobile ? 32 : 42,
                  lineHeight:
                    isMobile ? 37 : 46,
                  fontWeight: "900",
                  color: "#111827",
                  letterSpacing: -1.3,
                }}
              >
                Orders
              </Text>

              <Text
                style={{
                  marginTop: 7,
                  fontSize: 12,
                  lineHeight: 18,
                  color: "#64748b",
                }}
              >
                Track and manage your
                purchases.
              </Text>
            </View>

            <Pressable
              onPress={handleRefresh}
              disabled={refreshing}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                opacity: refreshing ? 0.5 : 1,
              }}
            >
              <Ionicons
                name="refresh-outline"
                size={15}
                color="#111827"
              />

              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "900",
                  color: "#111827",
                  letterSpacing: 0.4,
                }}
              >
                REFRESH
              </Text>
            </Pressable>
          </View>
        </View>


        {/* ───────────────────────────────
            CONTENT
        ─────────────────────────────── */}

        <View
          style={{
            width: "100%",
            maxWidth: 1200,
            alignSelf: "center",
            paddingHorizontal:
              horizontalPadding,
          }}
        >
          {/* ERROR */}

          {error ? (
            <ErrorState
              message={error}
              onRetry={() =>
                fetchOrders()
              }
            />
          ) : orders.length === 0 ? (
            <EmptyOrders
              onShop={() =>
                router.push("/")
              }
            />
          ) : (
            <>
              {/* ───────────────────────
                  FILTERS
              ─────────────────────── */}

              <View
                style={{
                  marginBottom: 22,
                }}
              >
                <FilterBar
                  active={activeFilter}
                  onChange={setActiveFilter}
                  counts={counts}
                  isMobile={isMobile}
                />
              </View>


              {/* ───────────────────────
                  RESULT INFO
              ─────────────────────── */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: "#94a3b8",
                    fontWeight: "700",
                  }}
                >
                  {filteredOrders.length}{" "}
                  {filteredOrders.length === 1
                    ? "ORDER"
                    : "ORDERS"}
                </Text>

                {activeFilter !== "all" && (
                  <Pressable
                    onPress={() =>
                      setActiveFilter("all")
                    }
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "800",
                        color: PRIMARY,
                      }}
                    >
                      Clear filter
                    </Text>
                  </Pressable>
                )}
              </View>


              {/* ───────────────────────
                  FILTER EMPTY
              ─────────────────────── */}

              {filteredOrders.length ===
              0 ? (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#e8eceb",
                    borderRadius: 14,
                    paddingVertical: 65,
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="filter-outline"
                    size={28}
                    color="#cbd5e1"
                  />

                  <Text
                    style={{
                      marginTop: 13,
                      fontSize: 16,
                      fontWeight: "900",
                      color: "#111827",
                    }}
                  >
                    No{" "}
                    {activeFilter.toLowerCase()}{" "}
                    orders
                  </Text>

                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 11,
                      color: "#94a3b8",
                    }}
                  >
                    Try another order filter.
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    gap: 12,
                  }}
                >
                  {filteredOrders.map(
                    (order, index) => (
                      <OrderCard
                        key={
                          order?._id ||
                          index
                        }
                        order={order}
                        isMobile={isMobile}
                        initiallyOpen={
                          filteredOrders.length ===
                            1 &&
                          index === 0
                        }
                      />
                    )
                  )}
                </View>
              )}
            </>
          )}
        </View>


        {/* ───────────────────────────────
            BOTTOM TRUST
        ─────────────────────────────── */}

        {orders.length > 0 &&
          !error && (
            <View
              style={{
                width: "100%",
                maxWidth: 1200,
                alignSelf: "center",
                paddingHorizontal:
                  horizontalPadding,
                marginTop: 34,
                marginBottom: 22,
              }}
            >
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#edf0ef",
                  paddingTop: 18,
                  flexDirection:
                    "row",
                  flexWrap: "wrap",
                  gap: 18,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={15}
                    color="#64748b"
                  />

                  <Text
                    style={{
                      fontSize: 9,
                      color: "#64748b",
                      fontWeight: "700",
                    }}
                  >
                    Secure payments
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Ionicons
                    name="cube-outline"
                    size={15}
                    color="#64748b"
                  />

                  <Text
                    style={{
                      fontSize: 9,
                      color: "#64748b",
                      fontWeight: "700",
                    }}
                  >
                    Order tracking
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Ionicons
                    name="headset-outline"
                    size={15}
                    color="#64748b"
                  />

                  <Text
                    style={{
                      fontSize: 9,
                      color: "#64748b",
                      fontWeight: "700",
                    }}
                  >
                    Customer support
                  </Text>
                </View>
              </View>
            </View>
          )}
          <Footer/>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TrackOrder;