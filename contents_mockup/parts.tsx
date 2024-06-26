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
  //useWindowDimensions,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
//import { StatusBar } from "expo-status-bar";
import {
  //useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import styled from "styled-components/native";
import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
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
import * as Device from "expo-device";
import { Asset } from "expo-asset";
import { RR利用規約, PPプライバシーポリシー } from "../license";
import { captureRef } from "react-native-view-shot";

async function lockScreenOrientation() {
  await ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT_UP
  );
}

const insets: { top: number; bottom: number } = { top: 48, bottom: 34 };
const width = 414; //Dimensions.get("window").width
const height = 896; //Dimensions.get("window").height
type sssttt = {
  style: string;
};
const StatusBar = ({ style }: sssttt) => {
  return (
    <View
      style={{ top: 0, width: "100%", height: 44, backgroundColor: "#f2f3f5" }}
    />
  );
};

const re_first_boot = () => {
  //テスト用
  SecureStore.deleteItemAsync("not_first_boot_flag");
  log_out();
  super_reload();
};

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

const is_android = Platform.OS == "android";

const the_fetch = async (
  url: string,
  body: any,
  content_type = "application/json",
  response_type = "json"
) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: body ? "POST" : "GET",
      headers: {
        "Content-Type": content_type,
      },
      body: body,
    }).then((response) => {
      const statusCode = response.status;
      if (statusCode >= 200 && statusCode < 300) {
        // 成功した場合
        if (response_type == "json") {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          response.text().then((data) => {
            resolve(data);
          });
        }
      } else {
        if (response_type == "text") {
          //response_type=="text"が利用規約だけなので臨時的措置
          let message = "";
          switch (statusCode) {
            case 400:
              message =
                "Bad Request: サーバーがリクエストを理解できませんでした。";
              break;
            case 401:
              message = "Unauthorized: 認証が必要です。";
              break;
            case 403:
              message = "Forbidden: リソースへのアクセスが禁止されています。";
              break;
            case 404:
              message = "Not Found: リソースが見つかりませんでした。";
              break;
            case 500:
              message =
                "Internal Server Error: サーバー内部エラーが発生しました。";
            default:
              throw new Error(`Error ${statusCode}`);
          }
        }
        reject(new Error(`Error ${statusCode}`));
      }
    });
  });
};

const formdata_fetch = async (url: string, formdata: any, json: object) => {
  return new Promise((resolve, reject) => {
    const fileName = "temp_data.json";
    const fileUri = FileSystem.documentDirectory + fileName;
    // ファイルにJSONデータを書き込む
    FileSystem.writeAsStringAsync(fileUri, JSON.stringify(json))
      .then(() => {
        formdata.append("json", {
          name: fileName,
          uri: is_android ? fileUri : fileUri.replace("file://", ""),
          type: "application/json",
        });
        the_fetch(url, formdata, "multipart/form-data")
          .then((data: any) => {
            console.log(data);
            resolve(data);
          })
          .catch((error: Error) => {
            reject(error);
          });
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  });
};

const is_iPad = false; //is_android?false:Device.modelName?Device.modelName!.startsWith("iPad"):false;
const v_w = (percentage: number, mini_in_iPad = false) => {
  return (percentage / 100) * width;
};
/*const v_w = (percentage: number, mini_in_iPad = false) => {
  if (Dimensions.get("window").width <= Dimensions.get("window").height) {
    return (
      Dimensions.get("window").width *
      (percentage / 100) *
      (mini_in_iPad && is_iPad ? 0.75 : 1)
    );
  } else {
    return (
      Dimensions.get("window").height *
      (percentage / 100) *
      (mini_in_iPad && is_iPad ? 0.75 : 1)
    );
  }
}*/ const flexble_px = (px: number) => {
  return `${v_w(100) >= 500 ? px : px * 0.8}px;`; //一時的

  //return `${is_iPad ? px:px*0.8}px;`
};

const flexble_font_size = (size: number) => {
  return `font-size:${v_w(100) >= 500 ? size : size * 0.8}px;`; //一時的

  //return `font-size:${is_iPad ? size:size*0.8}px;`
};

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

const v_h = (percentage: number) => {
  if (Dimensions.get("window").width <= Dimensions.get("window").height) {
    return Dimensions.get("window").height * (percentage / 100);
  } else {
    return Dimensions.get("window").width * (percentage / 100);
  }
};

const bold_status = is_android
  ? `font-weight: bold;`
  : `font-family: "NotoSans_700Bold";`;

const General_text = styled.Text`
  color: #555555;
  ${is_android ? `` : `font-family: "NotoSans_400Regular";`}
`;

const General_input = styled.TextInput`
  color: #555555;
  ${is_android ? `` : `font-family: "NotoSans_400Regular";`}
`;

const General_button = styled(TouchableOpacity)``;

const General_vertical_line = styled.View`
  position: absolute;
  border-width: 0px;
  border-radius: 4px;
  background-color: #5a9fa6;
  width: 8px;
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

type rotation_view_props = {
  children: any;
};
const Rotation_view = ({ children }: rotation_view_props) => {
  //const { width, height } = useWindowDimensions();
  const [xsd, setxsd] = useState(children);
  const rrr = () => {
    setxsd(<View />);
    setxsd(
      <View style={{ top: width * 0.000001 - height * 0.000001 }}>
        {children}
      </View>
    );
  };
  useEffect(() => {
    // 画面サイズ変更のリスナーを追加
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        rrr();
      }
    );
    Dimensions.addEventListener("change", rrr);
    return () => {
      //ScreenOrientation.removeOrientationChangeListeners()
    };
  }, []);
  useEffect(() => {
    rrr();
  }, [children, width, height]);
  return (
    <View style={{ top: width * 0.000001 - height * 0.000001 }}>{xsd}</View>
  );
};

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
  second_option = "OK"
) => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      title, // アラートのタイトル
      content, // アラートのメッセージ
      first_option == second_option
        ? [
            {
              text: second_option,
              onPress: () => {
                resolve(second_option);
              },
            },
          ]
        : [
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
    const resetAction = CommonActions.reset({
      index: 0, // 初期スタックのインデックス
      routes: [{ name: "Login_page", params: {} }],
    });
    navigation.dispatch(resetAction);
  });
}

async function log_out(navigation: any = null, comfirmation = false) {
  if (comfirmation) {
    showalert("確認", "ログアウトしますか", "いいえ", "はい").then(
      (response: any) => {
        if (response == "はい") {
          log_out(navigation, false);
        }
      }
    );
  } else {
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
    //SecureStore.deleteItemAsync("not_first_boot_flag"); //テスト用
    if (navigation) {
      navigation.navigate("Search_page");
    }
  }
}

const clearSpecificImageCache = async (imageUrl: string) => {
  try {
    // キャッシュディレクトリのパス
    const cacheDir = FileSystem.cacheDirectory;
    const cacheFilePath = `${cacheDir}${imageUrl.split("/").pop()}`;

    // キャッシュファイルの削除
    await FileSystem.deleteAsync(cacheFilePath, { idempotent: true });
  } catch (error) {
    console.log(error);
    throw error;
  }
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
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Gray_out_page_touch = styled.TouchableOpacity`
  position: absolute;
  width: 10000px;
  height: 10000px;
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
    width: 100%;
    height: 100%;
    position: absolute;
  `;
  const gggref=useRef(null)
  ASDREF=gggref
  return (
    <Gray_out_page_base ref={gggref} style={{ height: height, width: width }}>
      <Gray_out_page_touch style={{ height: height, width: width }}
        activeOpacity={1}
        onPress={onPress}
      ></Gray_out_page_touch>
      {children}
    </Gray_out_page_base>
  );
};

type out_of_main_comp_props = {
  max_height?: number;
  setout_of_main: Function;
  children: any;
};
const Out_of_main_box_box = styled.View`
  width: 94%;
  top: 2.5%;
  left: 3%;
  max-height: ${95}%;
  border-radius: 30px;
  background-color: white;
`;
const Out_of_main_box = styled.ScrollView`
  width: 100%;
  border-radius: 30px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
`;

const Close_out_of_main_button_comp = ({ onPress = () => {} }) => {
  const Close_out_of_main_button = styled(General_button)`
    bottom: -0.5px;
    width: 100%;
    height: 60px;
    background-color: #41717c;
    ${is_android
      ? ""
      : `border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;`}
  `;

  const Close_out_of_main_button_text = styled(General_text)`
    ${bold_status}
    text-align: center;
    font-size: 36px;
    bottom: 0px;
    width: 100%;
    line-height: 60px;
    color: white;
  `;
  return (
    <Close_out_of_main_button onPress={onPress}>
      <Close_out_of_main_button_text>閉じる</Close_out_of_main_button_text>
    </Close_out_of_main_button>
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
function open_select_option_box({
  setout_of_main,
  option_list,
  selected_option = "",
  option_event,
  top_comp = <View />,
  no_option_comp = <View />,
  right_comp = <View />,
  right_comp_width = 0, //単位はpx  後でheightに直す
  right_event = () => {}, //引数はid:number,ref:ref
}: open_select_option_box_props) {
  const Option = styled.TouchableOpacity`
    border-top-width: 0px;
    border-bottom-width: 0px;
    border-color: #ffe599;
    width: 100%;
    min-height: 60px;
  `;

  const Option_text = styled(General_text)`
    left: 30px;
    font-size: 28px;
    line-height: 60px;
    color: #555555;
    width: 100%;
    padding-right: ${right_comp_width}px;
  `;

  const Option_selected = styled(Option)`
    background-color: #5a9fa6;
  `;

  const Option_text_selected = styled(Option_text)`
    color: white;
  `;

  const Right_comp = styled.TouchableOpacity`
    position: absolute;
    top: 0px;
    right: 0px;
    width: ${right_comp_width}px;
    aspect-ratio: 1;
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
        <Out_of_main_box_box>
          <Out_of_main_box>
            {top_comp}
            {option_list.map((option_data) => (
              <A死ね死ね死ね key={option_data.value} option={option_data} />
            ))}
          </Out_of_main_box>
          <Close_out_of_main_button_comp
            onPress={() => {
              setout_of_main(<View />);
            }}
          />
        </Out_of_main_box_box>
      </Gray_out_page>
    );
  } else {
    setout_of_main(
      <Gray_out_page
        onPress={() => {
          setout_of_main(<View />);
        }}
      >
        <StatusBar style="dark" />
        <Out_of_main_box_box>
          <Out_of_main_box>
            <View>
              {top_comp}
              {no_option_comp}
            </View>
          </Out_of_main_box>
          <Close_out_of_main_button_comp
            onPress={() => {
              setout_of_main(<View />);
            }}
          />
        </Out_of_main_box_box>
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
  return new Promise((resolve, reject) => {
    let deleted_flag = false;
    function An_alert() {
      //const insets = useSafeAreaInsets();
      //const { width, height } = useWindowDimensions();
      const Bottom_alert_box = styled.View`
        position: absolute;
        width: 100%;
        min-height: ${(is_top ? insets.top : insets.bottom) + 60}px;
        ${is_top
          ? `top:0px`
          : `bottom: ${above_footer ? width * (is_iPad ? 0.15 : 0.2) + insets.bottom : 0}px`};
        background-color: #008080;
      `;
      const Bottom_alert_box_warning = styled(Bottom_alert_box)`
        background-color: #ffd580;
      `;
      const Bottom_alert_text = styled(General_text)`
        text-align: left;
        ${flexble_font_size(28)}
        line-height: 60px;
        padding-left: 10%;
        width: 100%;
        height: 60px;
        color: white;
        ${is_top
          ? `margin-top:${insets.top}px`
          : `margin-bottom:${insets.bottom}px;`}
      `;
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
  is_priv?: boolean;
  top_text?: string;
  main_text?: string;
  left_small_option_text?: string;
  right_big_option_text?: string;
};

function Riyoukiyaku_comp({
  agree_event = () => {},
  deny_event = () => {},
  out_event = () => {},
  selectable = false,
  is_priv = false,
  top_text = is_priv ? "プライバシーポリシー" : "利用規約",
  main_text = is_priv ? PPプライバシーポリシー : RR利用規約,
  left_small_option_text = "拒否",
  right_big_option_text = "同意",
}: riyoukiyaku_comp_props) {
  //const { width, height } = useWindowDimensions();
  function AGOPPPPPP() {
    const Riyoukiyaku_box = styled.View`
      width: 94%;
      top: 3%;
      left: 3%;
      height: ${height > 800 ? `70%` : height > 600 ? `480px` : `94%`};
      border-radius: 35px;
      background-color: white;
    `;
    const Riyouki_top_box = styled.View`
      ${is_android
        ? ""
        : `border-top-left-radius: 35px;
    border-top-right-radius: 35px;`}

      background-color: #ffffff;
      height: 70px;
      border-bottom-width: 8px;
      border-color: #41717c;
    `;
    const Riyouki_top_text = styled(General_text)`
      line-height: 70px;
      ${flexble_font_size(36)}
      color: #41717c;
      text-align: center;
    `;
    const Riyouki_main = styled.View`
      width: 100%;
    `;
    const Riyouki_main_text = styled(General_text)`
      ${flexble_font_size(24)}
    `;
    const Riyouki_bottom_box = styled.View`
      height: ${flexble_px(80)};
    `;
    const Riyouki_bottom_button_wide = styled(General_button)`
      height: ${flexble_px(80)};
      background-color: #41717c;
      ${is_android
        ? ""
        : `border-bottom-left-radius: 35px;
    border-bottom-right-radius: 35px;`}
    `;

    const Riyouki_bottom_button_right = styled(Riyouki_bottom_button_wide)`
      position: absolute;
      width: 70%;
      right: 0%;
      ${is_android ? "" : `border-bottom-left-radius: ${v_w(0)}px;`}
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
      ${bold_status}
      line-height: ${flexble_px(80)};
      ${flexble_font_size(32)}
      color: #fffffd;
      text-align: center;
    `;
    return (
      <Riyoukiyaku_box activeOpacity={1}>
        <Riyouki_top_box>
          <Riyouki_top_text>{top_text}</Riyouki_top_text>
        </Riyouki_top_box>
        <ScrollView>
          <Riyouki_main>
            <Riyouki_main_text>{main_text}</Riyouki_main_text>
          </Riyouki_main>
        </ScrollView>
        <Riyouki_bottom_box>
          {selectable ? (
            <View>
              <Riyouki_bottom_button_right onPress={agree_event}>
                <Riyouki_bottom_button_text>
                  {right_big_option_text}
                </Riyouki_bottom_button_text>
              </Riyouki_bottom_button_right>
              <Riyouki_bottom_button_left onPress={deny_event}>
                <Riyouki_bottom_button_text>
                  {left_small_option_text}
                </Riyouki_bottom_button_text>
              </Riyouki_bottom_button_left>
            </View>
          ) : (
            <Riyouki_bottom_button_wide
              onPress={() => {
                out_event();
                deny_event();
              }}
            >
              <Riyouki_bottom_button_text>閉じる</Riyouki_bottom_button_text>
            </Riyouki_bottom_button_wide>
          )}
        </Riyouki_bottom_box>
      </Riyoukiyaku_box>
    );
  }
  return (
    <Gray_out_page onPress={out_event}>
      <View>
        <AGOPPPPPP />
      </View>
    </Gray_out_page>
  );
}
type navi_props = { navigation: any };

type navi_param_props = { route: any; navigation: any };

const captureScreen = async (viewRef: any) => {
  try {
    const uri = await captureRef(viewRef.current, {
      format: "png",
      quality: 0.8,
    });

    // 画像をBase64に変換
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result;

      // Base64データを含むJSONを送信
      try {
        const response = await fetch("http://192.168.1.16:8000/test/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64data }),
        });

        if (response.ok) {
          const jsonResponse = await response.json();
          console.log("Image uploaded successfully", jsonResponse);
        } else {
          alert("aaaa");
          console.error("Failed to upload image", response.statusText);
        }
      } catch (error) {
        alert("aaaa");
        console.error("Failed to upload image", error);
      }
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("Failed to capture screenshot", error);
  }
};

const Body_box = styled.View`
  background-color: #f1f3f5;
  width: ${width}px;
  hieght: ${height}px;
  top: 0px;
`;

const Body = styled.ScrollView`
  background-color: #f1f3f5;
  width: ${width}px;
  hieght: ${height}px;
`;

const Body_no_scroll = styled.View`
  background-color: #f1f3f5;
  width: 100%;
  height: 100%;
`;

const Footer_space = styled.View`
  position: relative;
  bottom: 0px;
  background-color: transparent;
`;

type main_base_props = {
  navigation: any;
  children: any;
  no_scroll?: boolean;
  background_transparent?: boolean;
};
const Satueibotan = styled.TouchableOpacity`
    position: absolute;
    bottom: -200px;
    width: 100px;
    height: 100px;
    background-color: #000000;
  `;
var ASDREF:any=null
const Main_base = ({
  navigation,
  children,
  no_scroll = false,
}: main_base_props) => {
  const AAAref = useRef();
  ASDREF=AAAref
  const Footer = ({ navigation }: navi_props) => {
    let user_id = get_user_id();
    //const insets = useSafeAreaInsets();
    //const { width, height } = useWindowDimensions();
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
    const Site_footer = styled.View`
      position: absolute;
      bottom: 0px;
      margin-right: auto;
      margin-left: auto;
      background-color: #c5cdd0;
      border-color: #ffffff;
      border-top-width: 0px;
    `;

    const Footer_option_box_box = styled.View`
      position: absolute;
      justify-content: center;
      text-align: center;
      height: 100%;
      width: 20%;
      border-color: black;
      border-width: 0px;
    `;

    const Footer_option_box = styled.TouchableOpacity`
      top: 0px;
      height: 100%;
      aspect-ratio: 1;
      text-align: center;
      vertical-align: middle;
      align-items: center;
      margin-left: auto;
      margin-right: auto;
      border-width: 0px;
      border-color: black;
    `;

    const Footer_text = styled(General_text)`
      position: absolute;
      width: 100%;
      text-align: center;
      font-size: ${v_w(4.0, true)}px;
      bottom: 0px;
      color: #ffffff;
    `;

    const My_icon_box = styled(Footer_option_box)`
      position: absolute;
      left: 0%;
    `;

    const My_icon_image = styled.Image`
      height: 100%;
      aspect-ratio: 1;
    `;

    const To_option_page_box = styled(Footer_option_box)`
      position: absolute;
      right: 0%;
    `;

    const option_page_svg = (props: SvgProps) => (
      <Svg
        //xmlns="http://www.w3.org/2000/svg"
        width={v_w(14.0, true)}
        height={v_w(14.0, true)}
        fill="none"
        stroke="#ffffff"
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
      position: relative;
      top: ${v_w(0.0)}px;
      width: ${v_w(14.0, true)}px;
      height: ${v_w(1.0)}px;
    `;

    const post_page_svg = (props: SvgProps) => (
      <Svg
        //xmlns="http://www.w3.org/2000/svg"
        width={v_w(14.0, true)}
        height={v_w(14.0, true)}
        fill="none"
        stroke="#ffffff"
        strokeLinecap="square"
        strokeWidth={1.5}
        aria-labelledby="newIconTitle"
        color="#ffffff"
        viewBox="0 0 24 24"
        {...props}
      >
        <Path d="M18.4142136 4.41421356L19.5857864 5.58578644C20.366835 6.36683502 20.366835 7.63316498 19.5857864 8.41421356L8 20 4 20 4 16 15.5857864 4.41421356C16.366835 3.63316498 17.633165 3.63316498 18.4142136 4.41421356zM14 6L18 10" />
      </Svg>
    );

    const To_post_icon_svg = styled(post_page_svg)`
      position: relative;
      top: ${v_w(0.0)}px;
      width: ${v_w(14.0, true)}px;
      height: ${v_w(1.0)}px;
    `;

    const To_search_page_box = styled(To_option_page_box)`
      right: 40%;
    `;

    const search_page_svg = (props: SvgProps) => (
      <Svg
        //xmlns="http://www.w3.org/2000/svg"
        width={v_w(14.0, true)}
        height={v_w(14.0, true)}
        fill="none"
        stroke="#ffffff"
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
      position: relative;
      top: ${v_w(0.0)}px;
      width: ${v_w(14.0, true)}px;
      height: ${v_w(1.0)}px;
    `;

    const to_notidication_svg_base = (props: SvgProps) => (
      <Svg
        //xmlns="http://www.w3.org/2000/svg"
        width={v_w(14.0, true)}
        height={v_w(14.0, true)}
        fill="none"
        stroke="#ffffff"
        strokeLinecap="square"
        strokeWidth={1.5}
        aria-labelledby="bellIconTitle"
        color="#ffffff"
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
      <Svg width={v_w(8, true)} height={v_w(8, true)} {...props}>
        <Circle cx={v_w(2)} cy={v_w(2)} r={v_w(2)} fill="#ffaf00" />
      </Svg>
    );

    const To_notification_icon_svg = styled(to_notidication_svg_base)`
      position: relative;
      top: ${v_w(0.0)}px;
      width: ${v_w(14.0, true)}px;
      height: ${v_w(1.0)}px;
    `;

    const To_notification_icon_svg_unread = styled(to_notidication_svg_unread)`
      ${is_iPad
        ? `
        top: -65%;
        left: 25%;
        width: 40%;
        height: 40%;
        `
        : `
        top: -65%;
        left: 25%;
        width: 40%;
        height: 40%;`}
    `;

    const To_signup_page_box = styled(TouchableOpacity)`
      position: absolute;
      top: 50%;
      left: 0px;
      width: 100%;
      height: 100%;
      vertical-align: middle;
      border-color: #ffffff;
      border-left-width: 1px;
      border-right-width: 1px;
      background-color: #5a9fa6;
      border-bottom-width: 1px;
    `;

    const To_signup_page = styled(General_text)`
      text-align: center;
      top: ${v_w(1.5) + insets.bottom / 2}px;
      font-size: ${v_w(4.0)}px;
      color: #ffffff;
    `;

    const To_login_page_box = styled(TouchableOpacity)`
      position: absolute;
      top: ${v_w(0.0)}px;
      left: ${v_w(0)}px;
      width: 100%;
      height: 50%;
      vertical-align: middle;
      border-color: #ffffff;
      border-left-width: 1px;
      border-right-width: 1px;
      background-color: #5a9fa6;
      border-color: #ffffff;
      border-bottom-width: 1px;
      border-top-width: 0px;
    `;

    const To_login_page = styled(General_text)`
      line-height:${flexble_px(v_w(5))}
      text-align: center;
      top: ${v_w(1.5)}px;
      font-size: ${v_w(4)}px;
      color: #ffffff;
    `;

    return (
      <Site_footer
        style={Object.assign(
          height > width
            ? { width: "100%", height: width * (is_iPad ? 0.15 : 0.2) }
            : { width: "100%", height: height * (is_iPad ? 0.15 : 0.2) },
          {
            bottom: insets.bottom,
          }
        )}
      >
        <To_option_page_box
          onPress={() => {
            navigation.navigate("Option_page");
          }}
        >
          <To_option_icon_svg />
          <Footer_text>その他</Footer_text>
        </To_option_page_box>
        <Footer_option_box_box style={{ left: "60%" }}>
          <Footer_option_box
            onPress={() => {
              navigation.navigate(user_id >= 1 ? "Post_page" : "Signup_page");
            }}
          >
            <To_post_icon_svg />
            <Footer_text>投稿</Footer_text>
          </Footer_option_box>
        </Footer_option_box_box>
        <Footer_option_box_box style={{ left: "40%" }}>
          <Footer_option_box
            onPress={() => {
              const resetAction = CommonActions.reset({
                index: 0, // 初期スタックのインデックス
                routes: [{ name: "Search_page", params: { search_words: "" } }],
              });
              navigation.dispatch(resetAction);
            }}
          >
            <To_search_icon_svg />
            <Footer_text>検索</Footer_text>
          </Footer_option_box>
        </Footer_option_box_box>
        <Footer_option_box_box style={{ left: "20%" }}>
          <Footer_option_box
            onPress={() => {
              navigation.navigate(
                user_id >= 1 ? "Notification_page" : "Signup_page"
              );
            }}
          >
            <To_notification_icon_svg />
            {unread_notification_comp}
            <Footer_text>通知</Footer_text>
          </Footer_option_box>
        </Footer_option_box_box>
        {user_id >= 1 ? (
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
        ) : (
          <Footer_option_box_box>
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
          </Footer_option_box_box>
        )}
      </Site_footer>
    );
  };

  //const insets = useSafeAreaInsets();
  const Footer_hagekakusi = styled.View`
    position: absolute;
    width: 100%;
    bottom: 0px;
    height: ${insets.bottom}px;
    background-color: #c5cdd0;
  `;
  //const { width, height } = useWindowDimensions();
  let [fontsLoaded] = is_android
    ? [0]
    : useFonts({
        NotoSans_400Regular,
        NotoSans_700Bold,
      });

  useFocusEffect(
    useCallback(() => {
      setvariable_part(<View />);
      setvariable_part(<Footer navigation={navigation} />);

      return () => {
        setvariable_part(<View />);
        // 画面がアンフォーカスされたときに実行する処理（オプション）

        //setsearch_result(<View></View>)
      };
    }, [])
  );
  const [variable_part, setvariable_part] = useState(
    <Footer navigation={navigation} />
  );
  

  if (no_scroll) {
    return (
      <SafeAreaView>
        <StatusBar style="dark" />
        <Body_no_scroll>
          <View>{children}</View>
          <Footer_space></Footer_space>
        </Body_no_scroll>
        <Footer_hagekakusi />
        {variable_part}
      </SafeAreaView>
    );
  } else {
    return (
      <Body_box ref={AAAref} style={{ height: height, width: width }}>
        <StatusBar style="dark" />
        <Body
          style={{ height: height - insets.top - insets.bottom, width: width }}
        >
          {children}
          <Footer_space
            style={Object.assign(
              height > width
                ? { height: width * (is_iPad ? 0.15 : 0.4) + insets.bottom }
                : {
                    height: height * (!is_iPad ? 0.15 : 0.4) + insets.bottom,
                  },
              {
                width: "100%",
              }
            )}
          ></Footer_space>
        </Body>
        <Footer_hagekakusi />
        {variable_part}
        <Satueibotan onPress={()=>{
          captureScreen(ASDREF)
        }} />
      </Body_box>
    );
  }
};
type main_base_no_footer_props = {
  navigation?: any;
  children: any;
  no_scroll?: boolean;
  background_color?: string;
  scroll_event?: Function;
};
const Main_base_no_footer = ({
  navigation = null,
  children,
  background_color = "#f1f3f5",
  scroll_event = (event: any) => {},
}: main_base_no_footer_props) => {
  const AAAref = useRef();
  ASDREF=AAAref
  let [fontsLoaded] = is_android
    ? [0]
    : useFonts({
        NotoSans_400Regular,
        NotoSans_700Bold,
      });
  return (
    <Body_box ref={AAAref} style={{ height: height, width: width }}>
    <StatusBar style="dark" />
    <Body
      style={{ height: height - insets.top - insets.bottom, width: width }}
    >
      {children}
      <Footer_space
        style={Object.assign(
          height > width
            ? { height: width * (is_iPad ? 0.15 : 0.4) + insets.bottom }
            : {
                height: height * (!is_iPad ? 0.15 : 0.4) + insets.bottom,
              },
          {
            width: "100%",
          }
        )}
      ></Footer_space>
    </Body>
    <Satueibotan onPress={()=>{
      captureScreen(ASDREF)
    }} />
  </Body_box>
  );
};

export {
  site_url,
  is_android,
  get_user_id,
  get_session_datas,
  get_uniqueid,
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
  Close_out_of_main_button_comp,
  Gray_out_page,
  Riyoukiyaku_comp,
  Rotation_view,
  is_iPad,
  bold_status,
  flexble_font_size,
  flexble_px,
  the_fetch,
  formdata_fetch,
  re_first_boot,
  insets,
  width,
  height,
  StatusBar,
  captureScreen,
};
