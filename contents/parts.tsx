import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Dimensions,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ImagePropsBase,
  Image,
  Platform,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import * as Updates from "expo-updates";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect, CommonActions } from "@react-navigation/native";
import Svg, { SvgProps, Path, Circle } from "react-native-svg";
import {
  useFonts,
  NotoSans_400Regular,
  NotoSans_700Bold,
} from "@expo-google-fonts/noto-sans";
import { RR利用規約 } from "../license";

async function lockScreenOrientation() {
  await ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT_UP
  );
}
// アプリを再読み込みする関数
const super_reload = async () => {
  try {
    await Updates.reloadAsync();
  } catch (e) {
    console.error(e);
  }
};

//const site_url = "http://192.168.1.16:8000/";
const site_url = "https://kachi-xtu.com/";

function is_android() {
  return Platform.OS == "android";
}

const get_uniqueid = () => {
  let stored_uuid = SecureStore.getItem("secure_deviceid");
  if (!stored_uuid || stored_uuid == "-1") {
    let uuid = uuidv4();
    SecureStore.setItemAsync("secure_deviceid", uuid);
    return uuid;
  } else {
    return stored_uuid;
  }
};

function get_session_datas() {
  let session_id_1 = SecureStore.getItem("session_id_1");
  if (session_id_1) {
    let session_id_2 = SecureStore.getItem("session_id_2");
    return {
      user_id: String(get_user_id()),
      session_id_1: session_id_1,
      session_id_2: session_id_2,
      device_unique_id: get_uniqueid(),
    };
  }
  return {
    user_id: "-1",
    session_id_1: "0",
    session_id_2: "0",
    device_unique_id: get_uniqueid(),
  };
}

function get_user_id() {
  let user_id_str = SecureStore.getItem("user_id");
  let user_id = -1;
  if (!user_id_str) {
    SecureStore.setItemAsync("user_id", "-1");
  } else {
    user_id = Number(user_id_str);
  }
  return user_id;
}

const v_w = (percentage: number) => {
  if (Dimensions.get("window").width <= Dimensions.get("window").height) {
    return Dimensions.get("window").width * (percentage / 100);
  } else {
    return Dimensions.get("window").height * (percentage / 100);
  }
};

const v_h = (percentage: number) => {
  if (Dimensions.get("window").width <= Dimensions.get("window").height) {
    return Dimensions.get("window").height * (percentage / 100);
  } else {
    return Dimensions.get("window").width * (percentage / 100);
  }
};

const General_text = styled.Text`
  color: #555555;
  font-family: "NotoSans_400Regular";
`;

const General_input = styled.TextInput`
  color: #555555;
  font-family: "NotoSans_400Regular";
`;

const General_button = styled(TouchableOpacity)``;

const General_vertical_line = styled.View`
  position: absolute;
  border-width: 0px;
  border-radius: ${v_w(0.5)}px;
  background-color: #5a9fa6;
  width: ${v_w(1)}px;
`;

const Center_image = styled.Image`
  margin-right: auto;
  margin-left: auto;
`;

const Image_with_aspect_ratio = ({
  image_url = "",
  width_percentage = 100,
}) => {
  const [aspectRatio, setAspectRatio] = useState(1); // 初期アスペクト比は1

  useEffect(() => {
    // 画像を読み込んでアスペクト比を計算する
    Image.getSize(
      image_url,
      (width, height) => {
        setAspectRatio(width / height);
      },
      (error) => {}
    );
  }, [image_url]);

  return (
    <Center_image
      source={{ uri: image_url }}
      style={{
        width: `${width_percentage}%`,
        aspectRatio,
        backgroundColor: "transparent",
      }}
      resizeMode="contain"
    />
  );
};

const content_exclusion_pattern = /(<|>|\u200b|\t|\&lt|\&gt)+/g;
function censor_content(
  text: string,
  allow_new_line = true,
  exclusion_pattern = content_exclusion_pattern
) {
  let censored_text = text.replace(/</g, "＜");
  censored_text = censored_text.replace(/>/g, "＞");
  censored_text = censored_text.replace(/\&lt/g, "＆lt");
  censored_text = censored_text.replace(/\&gt/g, "＆gt");
  censored_text = censored_text.replace(exclusion_pattern, "");
  censored_text = censored_text.replace(/\n\r/g, "\n");
  censored_text = censored_text.replace(/\r/g, "\n");
  if (allow_new_line == false) {
    censored_text = censored_text.replace(/\n/g, "");
  }
  return censored_text;
}

function input_content(text: string, setstate: Function, max_length = 100000) {
  if (text.length > max_length) {
    setstate(censor_content(text.slice(0, max_length)));
  } else {
    setstate(censor_content(text));
  }
}

const showalert = (
  title = "",
  content = "",
  first_option = "OK",
  second_option = "はい"
) => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      title, // アラートのタイトル
      content, // アラートのメッセージ
      [
        {
          text: first_option,
          onPress: () => {
            resolve(first_option);
          },
          style: "cancel",
        },
        {
          text: second_option,
          onPress: () => {
            resolve(second_option);
          },
        },
      ],
      { cancelable: true } // オプションでキャンセル可能かどうかを指定
    );
  });
};

const show_question = (title = "", content = "", cancelable = false) => {
  if (cancelable) {
    Alert.alert(
      title, // アラートのタイトル
      content, // アラートのメッセージ
      [
        {
          text: "はい",
          onPress: () => {
            return new Promise((resolve, reject) => {
              resolve("OK");
            });
          },
          style: "cancel",
        },
        {
          text: "いいえ",
          onPress: () => {
            return new Promise((resolve, reject) => {
              resolve("NG");
            });
          },
        },
        {
          text: "キャンセル",
          onPress: () => {
            return new Promise((resolve, reject) => {
              resolve("cancel");
            });
          },
        },
      ],
      { cancelable: true } // オプションでキャンセル可能かどうかを指定
    );
  } else {
    Alert.alert(
      title, // アラートのタイトル
      content, // アラートのメッセージ
      [
        {
          text: "はい",
          onPress: () => {
            return new Promise((resolve, reject) => {
              resolve("OK");
            });
          },
          style: "cancel",
        },
        {
          text: "いいえ",
          onPress: () => {
            return new Promise((resolve, reject) => {
              resolve("NG");
            });
          },
        },
      ],
      { cancelable: true } // オプションでキャンセル可能かどうかを指定
    );
  }
};

const request_media_permissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
};

const pickImage = async (maxImageSize = 1024 * 512) => {
  const isPermissionGranted = await request_media_permissions();
  if (!isPermissionGranted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 1,
    base64: true,
  });

  if (result.canceled) {
    return null;
  }

  let { uri: imageUri, base64: imageBase64 } = result.assets[0];
  const { width, height } = await ImageManipulator.manipulateAsync(
    imageUri,
    []
  );
  const fileSizeInBytes = await getFileSize(imageUri);

  if (fileSizeInBytes > maxImageSize) {
    const resizeFactor = Math.sqrt(maxImageSize / fileSizeInBytes);
    const newWidth = Math.floor(width * resizeFactor);
    const newHeight = Math.floor(height * resizeFactor);
    const resizedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: newWidth, height: newHeight } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    imageUri = resizedImage.uri;
    imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  return { imageUri, base64: imageBase64 };
};

async function getFileSize(uri: any) {
  const fileInfo: any = await FileSystem.getInfoAsync(uri);
  return fileInfo.size;
}

async function display_session_error(navigation: any) {
  SecureStore.setItemAsync("user_id", "-1");
  SecureStore.setItemAsync("session_id_1", "");
  SecureStore.setItemAsync("session_id_2", "");
  showalert(
    "セッション認証エラー",
    "セッション情報の認証でエラーが発生しました。\n\n再ログインしてください。"
  ).then(() => {
    navigation.navigate("Login_page");
  });
}

async function log_out(navigation: any) {
  let request_json_data = get_session_datas();
  fetch(site_url + "logout_process_app/", {
    method: "post",
    headers: {
      "Content-Type": "application/json", //JSON形式のデータのヘッダー
    },
    body: JSON.stringify(request_json_data),
  });
  SecureStore.setItemAsync("user_id", "-1");
  SecureStore.setItemAsync("session_id_1", "");
  SecureStore.setItemAsync("session_id_2", "");
  SecureStore.deleteItemAsync("not_first_boot_flag");
  navigation.navigate("Search_page");
}

const clearSpecificImageCache = async (imageUrl: string) => {
  Image.prefetch(imageUrl).then(() => {
    return new Promise((resolve, reject) => {
      let response_data = { result: "success" };
      resolve(response_data);
    });
  });
};

function jump_with_prams(
  screen_name: string,
  params_dict: any,
  navigation: any
) {
  navigation.setParams({});
  const navigateAction = CommonActions.navigate({
    name: screen_name,
    params: params_dict,
  });
  navigation.navigate(screen_name, params_dict);
}

const Gray_out_page_base = styled(SafeAreaView)`
  position: absolute;
  top: ${v_w(0.0)}px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Gray_out_page_touch = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
`;

type gray_out_page_props = {
  children: any;
  onPress?: Function;
};
const Gray_out_page = ({
  children,
  onPress = () => {},
}: gray_out_page_props) => {
  const VVV = styled.View`
    position: absolute;
  `;
  return (
    <Gray_out_page_base>
      <Gray_out_page_touch
        activeOpacity={1}
        onPress={onPress}
      ></Gray_out_page_touch>
      <VVV>{children}</VVV>
    </Gray_out_page_base>
  );
};

type open_select_option_box_props = {
  setout_of_main: Function;
  option_list: { value: number | string; label: string }[];
  selected_option?: number | string;
  option_event: Function;
  top_comp?: any;
  no_option_comp?: any;
  right_comp?: any;
  right_comp_width?: number;
  right_event?: Function;
};

const close_discussion_box_button_svg = (props: SvgProps) => (
  <Svg
    width={v_w(15)}
    height={v_w(15)}
    fill="#5a9fa6"
    stroke="#ffffff"
    strokeLinecap="square"
    strokeWidth={2}
    aria-labelledby="closeIconTitle"
    color="#2329D6"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="m6.343 6.343 11.314 11.314m-11.314 0L17.657 6.343" />
  </Svg>
);

const Close_discussion_box_button_svg = styled(close_discussion_box_button_svg)`
  top: ${v_w(-2.1)}px;
  left: ${v_w(-2.1)}px;
  height: ${v_w(10)}px;
  width: ${v_w(10)}px;
`;

const Close_discussion_box_button_view = styled.View`
  height: ${v_w(12.0)}px;
  width: ${v_w(12.0)}px;
  position: absolute;
  border-color: #41717c;
  background-color: #41717c;
  border-width: ${v_w(0.6)}px;
  border-radius: ${v_w(6.0)}px;
`;
const Close_discussion_box_button_base = () => {
  return (
    <Close_discussion_box_button_view>
      <Close_discussion_box_button_svg />
    </Close_discussion_box_button_view>
  );
};
function open_select_option_box({
  setout_of_main,
  option_list,
  selected_option = "",
  option_event,
  top_comp = <View />,
  no_option_comp = <View />,
  right_comp = <View />,
  right_comp_width = 0, //単位はvw
  right_event = () => {}, //引数はid:number,ref:ref
}: open_select_option_box_props) {
  const Select_optin_box = styled.ScrollView`
    width: ${v_w(94)}px;
    top: ${v_w(6)}px;
    left: ${v_w(3)}px;
    min-height: ${v_h(0)}px;
    max-height: ${v_h(95)}px;
    border-radius: ${v_w(5.0)}px;
    border-bottom-right-radius: ${v_w(0)}px;
    background-color: white;
  `;

  const Option = styled.TouchableOpacity`
    border-top-width: 0px;
    border-bottom-width: 0px;
    border-color: #ffe599;
    width: 100%;
    min-height: ${v_w(8)}px;
  `;

  const Option_text = styled(General_text)`
    left: ${v_w(6)}px;
    font-size: ${v_w(4)}px;
    line-height: ${v_w(8)}px;
    color: #555555;
    width: ${right_comp_width == 0
      ? "100%"
      : `${v_w(94 - right_comp_width)}px`};
  `;

  const Option_selected = styled(Option)`
    background-color: #5a9fa6;
  `;

  const Option_text_selected = styled(Option_text)`
    color: white;
  `;

  const Right_comp = styled.TouchableOpacity`
    position: absolute;
    top: ${v_w(0)}px;
    right: ${v_w(0)}px;
    width: ${v_w(right_comp_width)}px;
    height: ${v_w(8)}px;
  `;

  const Close_discussion_box_button = styled(General_button)`
    position: absolute;
    top: ${v_w(3)}px;
    left: ${v_w(86)}px;
    height: ${v_w(12.0)}px;
    width: ${v_w(12.0)}px;
  `;

  type a死ね死ね死ね = { option: { value: number | string; label: string } };
  function A死ね死ね死ね({ option }: a死ね死ね死ね) {
    const asinesinesine_ref = useRef(null);
    return (
      <View ref={asinesinesine_ref}>
        {selected_option == option.value ? (
          <Option_selected
            onPress={() => {
              option_event(option);
              setout_of_main(<View />);
            }}
          >
            <Option_text_selected>{option.label}</Option_text_selected>
            {right_comp_width == 0 ? (
              <View />
            ) : (
              <Right_comp
                onPress={() => {
                  right_event(option.value, asinesinesine_ref);
                }}
              >
                {right_comp}
              </Right_comp>
            )}
          </Option_selected>
        ) : (
          <Option
            onPress={() => {
              option_event(option);
              setout_of_main(<View />);
            }}
          >
            <Option_text>{option.label}</Option_text>
            {right_comp_width == 0 ? (
              <View />
            ) : (
              <Right_comp
                onPress={() => {
                  right_event(option.value, asinesinesine_ref);
                }}
              >
                {right_comp}
              </Right_comp>
            )}
          </Option>
        )}
      </View>
    );
  }

  if (option_list.length >= 1) {
    setout_of_main(
      <Gray_out_page
        onPress={() => {
          setout_of_main(<View />);
        }}
      >
        <StatusBar style="dark" />
        <View>
          <Select_optin_box>
            {top_comp}
            {option_list.map((option_data) => (
              <A死ね死ね死ね key={option_data.value} option={option_data} />
            ))}
          </Select_optin_box>
          <Close_discussion_box_button
            onPress={() => {
              setout_of_main(<View />);
            }}
          >
            <Close_discussion_box_button_base />
          </Close_discussion_box_button>
        </View>
      </Gray_out_page>
    );
  } else {
    setout_of_main(
      <Gray_out_page>
        <StatusBar style="dark" />
        <View>
          <Select_optin_box>
            {top_comp}
            {no_option_comp}
          </Select_optin_box>
          <Close_discussion_box_button
            onPress={() => {
              setout_of_main(<View />);
            }}
          >
            <Close_discussion_box_button_base />
          </Close_discussion_box_button>
        </View>
      </Gray_out_page>
    );
  }
}

type alert_buttom_props = {
  setout_of_main: Function;
  text: string;
  is_warning?: boolean;
  duration?: number;
  above_footer?: boolean;
  is_top?: boolean;
};
async function alert_buttom({
  //上にも出せる
  setout_of_main,
  text,
  is_warning = false,
  duration = 3,
  above_footer = false,
  is_top = true,
}: alert_buttom_props) {
  const Bottom_alert_box = styled.View`
    position: absolute;
    width: 100%;
    min-height: ${v_w(10)}px;
    ${is_top ? `top:${v_w(0)}px` : `bottom: ${above_footer ? 20 : 0}px`};
    background-color: #008080;
  `;
  const Bottom_alert_box_warning = styled(Bottom_alert_box)`
    background-color: #ffd580;
  `;
  const Bottom_alert_text = styled(General_text)`
    text-align: left;
    font-size: ${v_w(4)}px;
    line-height: ${v_w(5)}px;
    left: ${v_w(4)}px;
    top: ${v_w(is_top ? 4 : 1)}px;
    color: white;
  `;
  return new Promise((resolve, reject) => {
    let deleted_flag = false;
    function An_alert() {
      useEffect(() => {
        return () => {
          deleted_flag = true;
        };
      }, []);
      if (is_warning) {
        return (
          <Bottom_alert_box_warning>
            <Bottom_alert_text>{text}</Bottom_alert_text>
          </Bottom_alert_box_warning>
        );
      } else {
        return (
          <Bottom_alert_box>
            <Bottom_alert_text>{text}</Bottom_alert_text>
          </Bottom_alert_box>
        );
      }
    }
    setout_of_main(<An_alert />);
    setTimeout(() => {
      if (deleted_flag == false) {
        setout_of_main(<View />);
      }
      resolve(deleted_flag);
    }, duration * 1000);
  });
}

type riyoukiyaku_comp_props = {
  agree_event?: Function;
  deny_event?: Function;
  out_event?: Function;
  selectable?: boolean;
};

function Riyoukiyaku_comp({
  agree_event = () => {},
  deny_event = () => {},
  out_event = () => {},
  selectable = false,
}: riyoukiyaku_comp_props) {
  const Riyoukiyaku_box = styled.View`
    width: ${v_w(94)}px;
    top: ${v_w(3)}px;
    left: ${v_w(3)}px;
    height: ${v_h(60)}px;
    border-radius: ${v_w(5.0)}px;
    background-color: white;
  `;
  const Riyouki_top_box = styled.View`
    border-top-left-radius: ${v_w(5.0)}px;
    border-top-right-radius: ${v_w(5.0)}px;
    background-color: #ffffff;
    height: ${v_w(10)}px;
    border-bottom-width: ${v_w(1.0)}px;
    border-color: #41717c;
  `;
  const Riyouki_top_text = styled(General_text)`
    line-height: ${v_w(9)}px;
    font-size: ${v_w(4.5)}px;
    color: #41717c;
    text-align: center;
  `;
  const Riyouki_main = styled.View`
    width: 100%;
    min-height: ${v_w(40)}px;
  `;
  const Riyouki_main_text = styled(General_text)`
    font-size: ${v_w(3.5)}px;
  `;
  const Riyouki_bottom_box = styled.View`
    height: ${v_w(10)}px;
  `;
  const Riyouki_bottom_button_wide = styled(General_button)`
    height: ${v_w(10.0)}px;
    background-color: #41717c;
    border-bottom-left-radius: ${v_w(5.0)}px;
    border-bottom-right-radius: ${v_w(5.0)}px;
  `;

  const Riyouki_bottom_button_right = styled(Riyouki_bottom_button_wide)`
    position: absolute;
    width: 70%;
    right: 0%;
    border-bottom-left-radius: ${v_w(0)}px;
    border-left-width: ${v_w(1.0)}px;
    border-color: #ffffff;
  `;

  const Riyouki_bottom_button_left = styled(Riyouki_bottom_button_wide)`
    position: absolute;
    width: 30%;
    left: 0%;
    border-bottom-right-radius: ${v_w(0)}px;
    border-right-width: ${v_w(0)}px;
    border-color: #ffffff;
  `;

  const Riyouki_bottom_button_text = styled(General_text)`
    font-family: "NotoSans_700Bold";
    line-height: ${v_w(10)}px;
    font-size: ${v_w(4.5)}px;
    color: #fffffd;
    text-align: center;
  `;
  return (
    <Gray_out_page onPress={out_event}>
      <Riyoukiyaku_box activeOpacity={1}>
        <Riyouki_top_box>
          <Riyouki_top_text>利用規約</Riyouki_top_text>
        </Riyouki_top_box>
        <ScrollView>
          <Riyouki_main>
            <Riyouki_main_text>{RR利用規約}</Riyouki_main_text>
          </Riyouki_main>
        </ScrollView>
        <Riyouki_bottom_box>
          {selectable ? (
            <View>
              <Riyouki_bottom_button_right onPress={agree_event}>
                <Riyouki_bottom_button_text>同意</Riyouki_bottom_button_text>
              </Riyouki_bottom_button_right>
              <Riyouki_bottom_button_left onPress={deny_event}>
                <Riyouki_bottom_button_text>拒否</Riyouki_bottom_button_text>
              </Riyouki_bottom_button_left>
            </View>
          ) : (
            <Riyouki_bottom_button_wide onPress={out_event}>
              <Riyouki_bottom_button_text>閉じる</Riyouki_bottom_button_text>
            </Riyouki_bottom_button_wide>
          )}
        </Riyouki_bottom_box>
      </Riyoukiyaku_box>
    </Gray_out_page>
  );
}

const H3 = styled(General_text)`
  font-size: ${v_w(5.0)}px;
  color: #5a9fa6;
`;

const Body_box = styled.View`
  background-color: #f1f3f5;
  width: 100%;
  height: 100%;
`;
const Body = styled.ScrollView`
  background-color: #f1f3f5;
  width: ${v_w(100.0)}px;
  height: 100%;
`;

const Body_no_scroll = styled.View`
  background-color: #f1f3f5;
  width: 100%;
  height: 100%;
`;

const Footer_space = styled.View`
  position: relative;
  bottom: 0px;
  height: ${v_w(20)}px;
`;

const Site_footer = styled.View`
  position: absolute;
  bottom: ${v_w(0.0)}px;
  background-color: white;
  height: ${v_w(20)}px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
`;

const To_option_page_box = styled(TouchableOpacity)`
  position: absolute;
  right: 0%;
  width: ${v_w(20.0)}px;
  height: ${v_w(20.0)}px;
  text-align: center;
  vertical-align: middle;
  border-bottom-color: #5a9fa6;
  border-bottom-width: 0px;
  border-left-color: #5a9fa6;
  border-left-width: 0px;
  background-color: #ffffff;
`;

const option_page_svg = (props: SvgProps) => (
  <Svg
    //xmlns="http://www.w3.org/2000/svg"
    width={v_w(14)}
    height={v_w(14)}
    fill="none"
    stroke="#5a9fa6"
    strokeLinecap="square"
    strokeWidth={1.5}
    aria-labelledby="justifyIconTitle"
    color="#2329D6"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="M6 10h12M6 6h12M6 14h12M6 18h12" />
  </Svg>
);

const To_option_icon_svg = styled(option_page_svg)`
  position: absolute;
  top: ${v_w(0.0)}px;
  left: ${v_w(3.0)}px;
  width: ${v_w(14.0)}px;
  height: ${v_w(1.0)}px;
`;

const To_option_page_text = styled(General_text)`
  position: absolute;
  top: ${v_w(12.0)}px;
  text-align: center;
  width: ${v_w(20.0)}px;
  font-size: ${v_w(4.0)}px;
  line-height: ${v_w(8.0)}px;
  color: #5a9fa6;
`;

const To_search_page_box = styled(TouchableOpacity)`
  position: absolute;
  right: 40%;
  width: ${v_w(20.0)}px;
  height: ${v_w(20.0)}px;
  text-align: center;
  vertical-align: middle;
  border-bottom-color: #5a9fa6;
  border-bottom-width: 0px;
  border-left-color: #5a9fa6;
  border-left-width: 0px;
  background-color: #ffffff;
`;

const search_page_svg = (props: SvgProps) => (
  <Svg
    //xmlns="http://www.w3.org/2000/svg"
    width={v_w(14)}
    height={v_w(14)}
    fill="none"
    stroke="#5a9fa6"
    strokeLinecap="square"
    strokeWidth={1.5}
    aria-labelledby="searchIconTitle"
    color="#2329D6"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="M14.412 14.412 20 20" />
    <Circle cx={10} cy={10} r={6} />
  </Svg>
);

const To_search_icon_svg = styled(search_page_svg)`
  position: absolute;
  top: ${v_w(0.0)}px;
  left: ${v_w(3.0)}px;
  width: ${v_w(14.0)}px;
  height: ${v_w(1.0)}px;
`;

const To_search_page_text = styled(General_text)`
  position: absolute;
  top: ${v_w(12.0)}px;
  text-align: center;
  width: ${v_w(20.0)}px;
  font-size: ${v_w(4.0)}px;
  line-height: ${v_w(8.0)}px;
  color: #5a9fa6;
`;

const To_write_page_box = styled(TouchableOpacity)`
  position: absolute;
  top: ${v_w(0.0)}px;
  right: 20%;
  width: ${v_w(20.0)}px;
  height: ${v_w(20.0)}px;
  font-size: ${v_w(4.0)}px;
  line-height: ${v_w(10.0)}px;
  vertical-align: middle;
  border-left-color: #5a9fa6;
  border-left-width: 0px;
  background-color: #ffffff;
  border-bottom-color: #5a9fa6;
  border-bottom-width: 0px;
`;

const write_page_svg = (props: SvgProps) => (
  <Svg
    //xmlns="http://www.w3.org/2000/svg"
    width={v_w(14)}
    height={v_w(14)}
    fill="none"
    stroke="#5a9fa6"
    strokeLinecap="square"
    strokeWidth={1.5}
    aria-labelledby="newIconTitle"
    color="#5a9fa6"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="M18.4142136 4.41421356L19.5857864 5.58578644C20.366835 6.36683502 20.366835 7.63316498 19.5857864 8.41421356L8 20 4 20 4 16 15.5857864 4.41421356C16.366835 3.63316498 17.633165 3.63316498 18.4142136 4.41421356zM14 6L18 10" />
  </Svg>
);

const To_write_icon_svg = styled(write_page_svg)`
  position: absolute;
  top: ${v_w(0.0)}px;
  left: ${v_w(3.0)}px;
  width: ${v_w(14.0)}px;
  height: ${v_w(1.0)}px;
`;

const To_write_page_text = styled(General_text)`
  position: absolute;
  top: ${v_w(12.0)}px;
  text-align: center;
  width: ${v_w(20.0)}px;
  font-size: ${v_w(4.0)}px;
  line-height: ${v_w(8.0)}px;
  color: #5a9fa6;
`;

const To_notification_page_box = styled(TouchableOpacity)`
  position: absolute;
  top: ${v_w(0.0)}px;
  right: 60%;
  width: ${v_w(20.0)}px;
  height: ${v_w(20.0)}px;
  font-size: ${v_w(4.0)}px;
  line-height: ${v_w(10.0)}px;
  vertical-align: middle;
  border-left-color: #5a9fa6;
  border-left-width: 0px;
  background-color: #ffffff;
  border-bottom-color: #5a9fa6;
  border-bottom-width: 0px;
`;

const to_notidication_svg_base = (props: SvgProps) => (
  <Svg
    //xmlns="http://www.w3.org/2000/svg"
    width={v_w(14)}
    height={v_w(14)}
    fill="none"
    stroke="#5a9fa6"
    strokeLinecap="square"
    strokeWidth={1.5}
    aria-labelledby="bellIconTitle"
    color="#5a9fa6"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      strokeLinejoin="round"
      d="M18 9v5c0 2 .667 3.333 2 4H4c1.333-.667 2-2 2-4V9h0a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6Z"
    />
    <Path d="M10 18a2 2 0 1 0 4 0" />
  </Svg>
);

const to_notidication_svg_unread = (props: SvgProps) => (
  <Svg width={v_w(8)} height={v_w(8)} {...props}>
    <Circle cx={v_w(2)} cy={v_w(2)} r={v_w(2)} fill="#ffaf00" />
  </Svg>
);

const To_notification_icon_svg = styled(to_notidication_svg_base)`
  left: ${v_w(3.0)}px;
  width: ${v_w(14.0)}px;
  height: ${v_w(14.0)}px;
`;

const To_notification_icon_svg_unread = styled(to_notidication_svg_unread)`
  top: ${v_w(-12.0)}px;
  left: ${v_w(11.0)}px;
  width: ${v_w(14.0)}px;
  height: ${v_w(14.0)}px;
`;

const To_notification_page_text = styled(General_text)`
  position: absolute;
  top: ${v_w(12.0)}px;
  text-align: center;
  width: ${v_w(20.0)}px;
  font-size: ${v_w(4.0)}px;
  line-height: ${v_w(8.0)}px;
  color: #5a9fa6;
`;

const To_signup_page_box = styled(TouchableOpacity)`
  position: absolute;
  top: ${v_w(10.0)}px;
  left: ${v_w(0)}px;
  width: ${v_w(20.0)}px;
  height: ${v_w(10.0)}px;
  vertical-align: middle;
  border-color: #5a9fa6;
  border-left-width: 1px;
  border-right-width: 1px;
  background-color: #ffffff;
  border-bottom-width: 1px;
`;

const To_signup_page = styled(General_text)`
  text-align: center;
  font-size: ${v_w(4.0)}px;
  line-height: ${v_w(10.0)}px;
  color: #5a9fa6;
`;

const To_login_page_box = styled(TouchableOpacity)`
  position: absolute;
  top: ${v_w(0.0)}px;
  left: ${v_w(0)}px;
  width: ${v_w(20.0)}px;
  height: ${v_w(10.0)}px;
  vertical-align: middle;
  border-color: #5a9fa6;
  border-left-width: 1px;
  border-right-width: 1px;
  background-color: #ffffff;
  border-color: #5a9fa6;
  border-bottom-width: 1px;
  border-top-width: 1px;
`;

const To_login_page = styled(General_text)`
  text-align: center;
  font-size: ${v_w(3.2)}px;
  line-height: ${v_w(10.0)}px;
  color: #5a9fa6;
`;

const My_icon_box = styled(TouchableOpacity)`
  position: absolute;
  top: ${v_w(0.0)}px;
  left: 0%;
  width: ${v_w(20.0)}px;
  height: ${v_w(20.0)}px;
  vertical-align: middle;
  border-color: #5a9fa6;
  border-right-width: 1px;
  background-color: #ffffff;
`;

const My_icon_image = styled.Image`
  width: ${v_w(20.0)}px;
  height: ${v_w(20.0)}px;
`;
type navi_props = { navigation: any };

type navi_param_props = { route: any; navigation: any };

type main_base_props = {
  navigation: any;
  children: any;
  no_scroll?: boolean;
  background_transparent?: boolean;
};
const Main_base = ({
  navigation,
  children,
  no_scroll = false,
}: main_base_props) => {
  const Branch_out_by_login = ({ navigation }: navi_props) => {
    let user_id = get_user_id();
    const [unread_notification_comp, setunread_notification_comp] = useState(
      <View />
    );
    useEffect(() => {
      let request_json_data = get_session_datas();
      if (user_id >= 1) {
        fetch(site_url + "get_unread_notification_flag/", {
          method: "post",
          headers: {
            "Content-Type": "application/json", //JSON形式のデータのヘッダー
          },
          body: JSON.stringify(request_json_data),
        })
          .then((response) => response.json())
          .then((data: any) => {
            if (data["result"] == "success") {
              if (data["exist_unread_notification_flag"] == "y") {
                setunread_notification_comp(
                  <To_notification_icon_svg_unread />
                );
              }
            }
          });
      }
    }, []);
    if (user_id >= 1) {
      return (
        <View>
          <To_notification_page_box
            onPress={() => {
              navigation.navigate("Notification_page");
            }}
          >
            <To_notification_icon_svg />
            {unread_notification_comp}
            <To_notification_page_text>通知</To_notification_page_text>
          </To_notification_page_box>
          <To_search_page_box
            onPress={() => {
              const resetAction = CommonActions.reset({
                index: 0, // 初期スタックのインデックス
                routes: [{ name: "Search_page", params: { search_words: "" } }],
              });
              navigation.dispatch(resetAction);
            }}
          >
            <To_search_icon_svg />
            <To_search_page_text>検索</To_search_page_text>
          </To_search_page_box>
          <To_write_page_box
            onPress={() => {
              navigation.navigate("Post_page");
            }}
          >
            <To_write_icon_svg />
            <To_write_page_text>投稿</To_write_page_text>
          </To_write_page_box>
          <My_icon_box
            onPress={() => {
              navigation.navigate("My_page");
            }}
          >
            <My_icon_image
              source={{
                uri: site_url + `media/user_icons/user_icon_${user_id}.png`,
              }}
            ></My_icon_image>
          </My_icon_box>
          <To_option_page_box
            onPress={() => {
              navigation.navigate("Option_page");
            }}
          >
            <To_option_icon_svg />
            <To_option_page_text>その他</To_option_page_text>
          </To_option_page_box>
        </View>
      );
    } else {
      return (
        <View>
          <To_option_page_box
            onPress={() => {
              navigation.navigate("Option_page");
            }}
          >
            <To_option_icon_svg />
            <To_option_page_text>その他</To_option_page_text>
          </To_option_page_box>
          <To_notification_page_box
            onPress={() => {
              navigation.navigate("Signup_page");
            }}
          >
            <To_notification_icon_svg />
            {unread_notification_comp}
            <To_notification_page_text>通知</To_notification_page_text>
          </To_notification_page_box>
          <To_search_page_box
            onPress={() => {
              const resetAction = CommonActions.reset({
                index: 0, // 初期スタックのインデックス
                routes: [{ name: "Search_page", params: { search_words: "" } }],
              });
              navigation.dispatch(resetAction);
            }}
          >
            <To_search_icon_svg />
            <To_search_page_text>検索</To_search_page_text>
          </To_search_page_box>
          <To_write_page_box
            onPress={() => {
              navigation.navigate("Signup_page");
            }}
          >
            <To_write_icon_svg />
            <To_write_page_text>投稿</To_write_page_text>
          </To_write_page_box>
          <To_signup_page_box
            onPress={() => {
              navigation.navigate("Signup_page");
            }}
          >
            <To_signup_page>登録</To_signup_page>
          </To_signup_page_box>
          <To_login_page_box
            onPress={() => {
              navigation.navigate("Login_page");
            }}
          >
            <To_login_page>ログイン</To_login_page>
          </To_login_page_box>
        </View>
      );
    }
  };
  let [fontsLoaded] = useFonts({
    NotoSans_400Regular,
    NotoSans_700Bold,
  });
  useFocusEffect(
    useCallback(() => {
      setvariable_part(<View />);
      setvariable_part(<Branch_out_by_login navigation={navigation} />);

      return () => {
        setvariable_part(<View />);
        // 画面がアンフォーカスされたときに実行する処理（オプション）

        //setsearch_result(<View></View>)
      };
    }, [])
  );
  useEffect(() => {
    if (true) {
    }
    lockScreenOrientation();
    // 画面が遷移される場合はunlockする処理を書いておく必要があります
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);
  const [variable_part, setvariable_part] = useState(
    <Branch_out_by_login navigation={navigation} />
  );
  if (no_scroll) {
    return (
      <SafeAreaView>
        <StatusBar style="dark" />
        <Body_no_scroll>
          {children}
          <Footer_space></Footer_space>
        </Body_no_scroll>
        <Site_footer>{variable_part}</Site_footer>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView>
        <StatusBar style="dark" />
        <Body>
          {children}
          <Footer_space></Footer_space>
        </Body>
        <Site_footer>{variable_part}</Site_footer>
      </SafeAreaView>
    );
  }
};

const Main_base_no_footer = ({
  navigation,
  children,
  background_transparent = false,
}: main_base_props) => {
  const B_100 = styled.View`
    background-color: ${background_transparent ? "transparent" : "#f1f3f5"};
    width: 100%;
    height: 100%;
  `;
  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <B_100>{children}</B_100>
    </SafeAreaView>
  );
};

export {
  site_url,
  is_android,
  get_user_id,
  get_session_datas,
  get_uniqueid,
  H3,
  v_w,
  v_h,
  censor_content,
  showalert,
  Body,
  open_select_option_box,
  General_text,
  General_button,
  General_input,
  General_vertical_line,
  navi_props,
  navi_param_props,
  super_reload,
  Image_with_aspect_ratio,
  pickImage,
  clearSpecificImageCache,
  Main_base,
  Main_base_no_footer,
  show_question,
  jump_with_prams,
  input_content,
  alert_buttom,
  display_session_error,
  log_out,
  Close_discussion_box_button_base,
  Gray_out_page,
  Riyoukiyaku_comp,
};
