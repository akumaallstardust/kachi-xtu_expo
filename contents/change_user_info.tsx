import {
  site_url,
  Main_base_no_footer,
  v_w,
  H3,
  General_button,
  General_input,
  showalert,
  get_uniqueid,
  get_user_id,
  get_session_datas,
  super_reload,
  v_h,
  censor_content,
  General_vertical_line,
  navi_props,
  Main_base,
  clearSpecificImageCache,
  alert_buttom,
  Gray_out_page,
} from "./parts";
import { CommonActions } from "@react-navigation/native";
import { password_patteen } from "./login_signup";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { err } from "react-native-svg";

const Change_user_info_box = styled.View`
  position: relative;
  top: ${v_w(3.0)}px;
  left: 0%;
  width: 100%;
  min-height: ${v_w(80.0)}px;
  padding-top: ${v_w(0.0)}px;
  border-radius: ${v_w(5.0)}px;
  background-color: #ffffff;
  text-align: left;
`;

const Change_icon_input_box = styled.View`
  position: absolute;
  top: 0px;
  left: ${v_w(0.0)}px;
  width: ${v_w(35.0)}px;
  height: ${v_w(40.0)}px;
  border-radius: ${v_w(3.0)}px;
  background-color: white;
  border-color: #b6c3c6;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-right-width: 1px;
  border-left-width: 1px;
`;

const Change_icon_input_image = styled.Image`
  width: ${v_w(30)}px;
  height: ${v_w(30)}px;
  position: relative;
  margin-left: ${v_w(2.5)}px;
  top: ${v_w(1.0)}px;
  position: relative;
`;

const Change_icon_input_button = styled.TouchableOpacity`
  bottom: ${v_w(0.0)}px;
  position: absolute;
  border-radius: ${v_w(3.0)}px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  width: 100%;
  height: ${v_w(8)}px;
  border-color: #b6c3c6;
  border-top-width: 1px;
`;

const Change_icon_input_button_text = styled.Text`
  font-size: ${v_w(4.0)}px;
  text-align: center;
  color: #5a9fa6;
  line-height: ${v_w(8)}px;
`;

const Change_username_box = styled.View`
  top: ${v_w(3.0)}px;
  position: relative;
  left: ${v_w(35.0)}px;
  width: ${v_w(60.0)}px;
`;

const Change_user_info_vertical_line = styled(General_vertical_line)`
  height: ${v_w(8.0)}px;
  left: ${v_w(3.0)}px;
`;

const Change_user_info_input_text = styled.Text`
  position: relative;
  left: ${v_w(4.0)}px;
  font-size: ${v_w(4.0)}px;
  padding-left: ${v_w(2.0)}px;
  line-height: ${v_w(8.0)}px;
  color: #5a9fa6;
`;

const Change_username_input = styled(General_input)`
  top: ${v_w(10.0)}px;
  position: absolute;
  left: ${v_w(6.0)}px;
  width: ${v_w(50.0)}px;
  background-color: #f5f5f5;
  border-width: 1px;
  border-color: #41717c;
  padding-left: ${v_w(3.0)}px;
  height: ${v_w(6.0)}px;
  border-radius: ${v_w(3.0)}px;
  font-size: ${v_w(3.5)}px;
`;

const Change_profile_box = styled.View`
  top: ${v_w(14)}px;
  position: relative;
  left: ${v_w(35.0)}px;
  width: ${v_w(60.0)}px;
`;

const Change_profile_input = styled(General_input)`
  top: ${v_w(10.0)}px;
  position: absolute;
  left: ${v_w(6.0)}px;
  width: ${v_w(50.0)}px;
  min-height: ${v_w(20.0)}px;
  background-color: #f5f5f5;
  border-width: 1px;
  border-color: #41717c;
  padding-left: ${v_w(1.0)}px;
  height: ${v_w(6.0)}px;
  border-radius: ${v_w(0)}px;
  font-size: ${v_w(3.5)}px;
`;

const Change_user_info_button = styled(General_button)`
  position: absolute;
  bottom: ${v_w(10.0)}px;
  left: 30%;
  width: 35%;
  font-size: ${v_w(3.0)}px;
  height: ${v_w(10)}px;
  border-radius: ${v_w(1.6)}px;
  border-color: #41717c;
  border-width:${v_w(0.8)}px;
  background-color: #ffffff;
`;

const Change_user_info_button_text = styled.Text`
  color: #41717c;
  line-height: ${v_w(8.4)}px;
  text-align: center;
  font-size: ${v_w(5)}px;
`;

const request_media_permissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
};
async function getFileSize(uri: any) {
  const fileInfo: any = await FileSystem.getInfoAsync(uri);
  return fileInfo.size;
}
const username_exclusion_pattern = /(>|<| |　|★|☆|\u200b|&lt;|,|\n|\r|\t)+/g;
function Change_user_info_page({ navigation }: navi_props) {
  const user_id = get_user_id();
  const [username, setusername] = useState("");
  const [profile, setprofile] = useState("");
  const [icon_uri, seticon_uri] = useState(
    site_url + `media/user_icons/user_icon_${user_id}.png`
  );
  const [icon_base_64, seticon_base_64] = useState("");
  const [icon_inputed_flag, seticon_inputed_flag] = useState(false);

  useEffect(() => {
    if (user_id >= 1) {
      let request_json_data = {
        user_id: String(user_id),
        get_f_f: "n",
      };
      fetch(site_url + "get_user_data_process/", {
        method: "post",
        headers: {
          "Content-Type": "application/json", //JSON形式のデータのヘッダー
        },
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["result"] == "success") {
            setusername(data["username"]);
            setprofile(data["user_profile"]);
          } else {
            showalert(
              "エラー",
              "エラーコード:日光は涼しい\n\nページを読み込み直した後も確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
            );
          }
        })
        .catch((error: Error) => {
          console.log(error);
          showalert(
            "通信エラー",
            "エラーコード:東尋坊は絶景\n\n通信状況が問題ないことを確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
          );
        });
    } else {
      navigation.navigate("Login_page");
    }
  }, []);
  const pick_icon_image = async () => {
    const isPermissionGranted = await request_media_permissions();
    if (!isPermissionGranted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      aspect: [1, 1],
      base64: true,
    });

    if (!result.canceled) {
      // 選択した画像のURIを取得
      let imageUri = result.assets[0].uri;
      let image_base64 = result.assets[0].base64;
      let { width, height } = await ImageManipulator.manipulateAsync(
        imageUri,
        []
      );

      // 画像のサイズが1MBを超えるかどうかを確認
      let newWidth = width;
      let newHeight = height;
      let resizeFactor = 1;
      const fileSizeInBytes = await getFileSize(imageUri);
      if (fileSizeInBytes > 1024 * 1024 * 10) {
        // 1MB = 1048576 bytes
        // 1MB未満になるまで画像を縮小

        while (
          fileSizeInBytes * resizeFactor * resizeFactor >
          1024 * 1024 * 10
        ) {
          resizeFactor -= 0.1; // 10%ずつ縮小
        }
        newWidth *= resizeFactor;
        newHeight *= resizeFactor;

        // ImageManipulatorを使用して画像のサイズを変更
      }
      const resizedUri = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      // 変更後の画像のURIを返す
      imageUri = resizedUri.uri;
      image_base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      seticon_base_64(image_base64);
      seticon_inputed_flag(true);
      seticon_uri(imageUri);
    } else {
    }
  };
  const [upload_processing_flag, setupload_processing_flag] = useState(false);
  let changed_flag = false;
  function check_and_post() {
    if (upload_processing_flag == false) {
      let request_json_data = {
        new_username: username,
        new_profile: profile,
        icon_inputed_flag: icon_inputed_flag ? "y" : "n",
        image_base64: icon_inputed_flag ? icon_base_64 : "",
      };
      request_json_data = Object.assign(get_session_datas(), request_json_data);
      setupload_processing_flag(true);
      fetch(site_url + "change_user_info_process/app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["result"] == "success") {
            if (icon_inputed_flag) {
              clearSpecificImageCache(
                site_url + `media/user_icons/user_icon_${user_id}.png`
              );
              clearSpecificImageCache(
                site_url + `media/user_icons/user_icon_mini_${user_id}.png`
              ).then((data: any) => {
                showalert("","変更に成功しました").then(()=>{
                  super_reload()
                })
              });
            }
            else{
              showalert("","変更に成功しました").then(()=>{
                const resetAction = CommonActions.reset({
                  index: 0, // 初期スタックのインデックス
                  routes: [{ name: 'My_page', params: {} }],
                });
                navigation.dispatch(resetAction);
              })
            }
            setupload_processing_flag(false);
            //super_reload();
          } else if (data["result"] == "user_overlap_error") {
            setupload_processing_flag(false);
            showalert(
              "ニックネーム重複",
              "既に使われているニックネームです\nニックネームを使われていないものに変更してください"
            );
          } else {
            setupload_processing_flag(false);
            showalert(
              "エラー",
              "エラーコード:箸入れペンケースとして使ってる\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
            );
          }
        })
        .catch((error) => {
          setupload_processing_flag(false);
          showalert(
            "通信エラー",
            "エラーコード:オーシャンビューのホテルから見える海が貨物港\n\n通信状態を確認してください\n\n通信状態を確認した後もこのメッセージが表示される場合はエラーコードと共に運営に伝えてください。"
          );
          console.log(error);
        });
    } else {
      console.warn("処理中です");
    }
  }
  return (
    <Main_base navigation={navigation}>
      <Change_user_info_box>
        <Change_icon_input_box>
          <Change_icon_input_image
            source={{
              uri: icon_uri,
            }}
          />
          <Change_icon_input_button
            onPress={() => {
              pick_icon_image();
            }}
          >
            <Change_icon_input_button_text>
              アイコンを変更
            </Change_icon_input_button_text>
          </Change_icon_input_button>
        </Change_icon_input_box>
        <Change_username_box>
          <Change_user_info_vertical_line />
          <Change_user_info_input_text>
            ニックネーム
          </Change_user_info_input_text>
          <Change_username_input
            value={username}
            placeholder={"ニックネームを入力(最大50文字)"}
            placeholderTextColor={"#b7b7b7"}
            onChangeText={(inputed_title: string) => {
              let new_username = censor_content(inputed_title);
              new_username = new_username.replace(
                username_exclusion_pattern,
                ""
              );
              if (inputed_title.length >= 51) {
                new_username = new_username.slice(0, 50);
              }
              setusername(new_username);
            }}
          />
        </Change_username_box>
        <Change_profile_box>
          <Change_user_info_vertical_line />
          <Change_user_info_input_text>
            プロフィール
          </Change_user_info_input_text>
          <Change_profile_input
            style={{
              textAlignVertical: "top",
            }}
            multiline={true}
            value={profile}
            placeholder={"プロフィールを入力(最大50文字)"}
            placeholderTextColor={"#b7b7b7"}
            onChangeText={(inputed_title: string) => {
              let new_profile = censor_content(inputed_title);
              if (inputed_title.length >= 51) {
                new_profile = new_profile.slice(0, 50);
              }
              let matches = new_profile.match(/\n/g);
              let new_line_count = matches ? matches.length : 0;
              if (new_line_count >= 4) {
                let texts = new_profile.split("\n");
                new_profile = "";
                for (let i = 0; i < texts.length; i++) {
                  new_profile += texts[i];
                  if (i <= 2) {
                    //3回まで
                    new_profile += "\n"; //new_line_count >= 4なので無条件で改行が足せる
                  }
                }
              }
              setprofile(new_profile);
            }}
          />
        </Change_profile_box>
        <Change_user_info_button
          onPress={() => {
            check_and_post();
          }}
        >
          <Change_user_info_button_text>
            変更を送信
          </Change_user_info_button_text>
        </Change_user_info_button>
      </Change_user_info_box>
    </Main_base>
  );
}

const Password_input_box = styled.View`
  text-align: center;
  width: 80%;
  left: 10%;
  margin-bottom: ${v_w(12)}px;
`; //何故か関数の外でないといけない

const Password_input = styled.TextInput.attrs({ secureTextEntry: true })`
  width: 100%;
  background-color: #f5f5f5;
  padding-left: ${v_w(3.0)}px;
  height: ${v_w(10.0)}px;
  border-radius: ${v_w(3.0)}px;
  font-size: ${v_w(4)}px;
  color: #555555;
  border-color: #41717c;
`; //何故か関数の外でないといけない

function Change_password_page({ navigation }: navi_props) {
  const [out_of_main, setout_of_main] = useState(<View />);
  const C死ね = styled.View`
    border-bottom-width: 1px;
    border-color: #41717c;
    margin-bottom: ${v_w(5)}px;
  `;
  const Change_password_page_text = styled.Text`
    width: 100%;
    height: ${v_w(10)}px;
    color:#5a9fa6;
    line-height: ${v_w(10)}px;
    text-align: center;
    font-size: ${v_w(5)}px;
  `;

  const Change_password_input = styled(General_input)`
    top: ${v_w(10.0)}px;
    position: absolute;
    left: ${v_w(6.0)}px;
    width: ${v_w(50.0)}px;
    background-color: #f5f5f5;
    border-width: 1px;
    border-color: #41717c;
    padding-left: ${v_w(3.0)}px;
    height: ${v_w(6.0)}px;
    border-radius: ${v_w(3.0)}px;
    font-size: ${v_w(3.5)}px;
  `;
  const user_id = get_user_id();
  const [password_old, setpassword_old] = useState("");
  const [password_new, setpassword_new] = useState("");
  useEffect(() => {
    if (user_id >= 1) {
    } else {
      navigation.navigate("Login_page");
    }
  }, []);

  const [upload_processing_flag, setupload_processing_flag] = useState(false);
  function check_and_post() {
    if (!password_patteen.test(password_new)) {
      alert_buttom({
        setout_of_main: setout_of_main,
        text: "新しいパスワードが不正です",
        is_warning: true,
        is_top: true,
      });
    } else if (!password_patteen.test(password_old)) {
      alert_buttom({
        setout_of_main: setout_of_main,
        text: "現在のパスワードが不正です",
        is_warning: true,
        is_top: true,
      });
    } else if(password_new==password_old){
      alert_buttom({
        setout_of_main: setout_of_main,
        text: "新しいパスワードと古いパスワードが同じです",
        is_warning: true,
        is_top: true,
      });
    }
    else if (upload_processing_flag) {
      alert_buttom({
        setout_of_main: setout_of_main,
        text: "処理中です",
        is_warning: true,
        is_top: true,
      });
    } else {
      let request_json_data = {
        password_old: password_old,
        password_new: password_new,
      };
      request_json_data = Object.assign(get_session_datas(), request_json_data);
      setupload_processing_flag(true);
      fetch(site_url + "changepassword/process/app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["result"] == "success") {
            alert_buttom({
              setout_of_main: setout_of_main,
              text: "変更に成功しました",
              is_top: true,
            });
            const resetAction = CommonActions.reset({
              index: 0, // 初期スタックのインデックス
              routes: [{ name: 'My_page', params: {} }],
            });
            navigation.dispatch(resetAction);
          } else if(data["result"]="failed_password"){
            alert_buttom({
              setout_of_main: setout_of_main,
              text: "現在のパスワードが間違っています",
              is_top: true,
              is_warning:true,
            });
          }
          else {
            console.log(data)
            setupload_processing_flag(false);
            showalert(
              "エラー",
              "エラーコード:小説は音楽聞きながら読むもの\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
            );
          }
        })
        .catch((error) => {
          setupload_processing_flag(false);
          showalert(
            "通信エラー",
            "エラーコード:死亡フラグ 雨少ししか降ってないから傘いらないな!\n\n通信状態を確認してください\n\n通信状態を確認した後もこのメッセージが表示される場合はエラーコードと共に運営に伝えてください。"
          );
          console.log(error);
        });
    }
  }
  return (
    <View>
      <Main_base navigation={navigation}>
        <Change_user_info_box>
          <C死ね>
            <Change_password_page_text>
              パスワード変更
            </Change_password_page_text>
          </C死ね>
          <Password_input_box>
            <Password_input
              value={password_old}
              placeholder={"現在のパスワード"}
              placeholderTextColor={"#b7b7b7"}
              max_length={255}
              onChangeText={(inputed_password_old: string) => {
                if (
                  password_patteen.test(inputed_password_old) ||
                  inputed_password_old.length == 0
                ) {
                  setpassword_old(inputed_password_old);
                } else {
                  alert_buttom({
                    setout_of_main: setout_of_main,
                    text: "パスワードに使用可能な文字は英数字と_?!#`$のみです",
                    is_warning: true,
                    is_top: true,
                  });
                }
              }}
            />
          </Password_input_box>
          <Password_input_box>
            <Password_input
              value={password_new}
              placeholder={"新しいパスワード"}
              placeholderTextColor={"#b7b7b7"}
              max_length={255}
              onChangeText={(inputed_password_new: string) => {
                if (
                  password_patteen.test(inputed_password_new) ||
                  inputed_password_new.length == 0
                ) {
                  setpassword_new(inputed_password_new);
                } else {
                  alert_buttom({
                    setout_of_main: setout_of_main,
                    text: "パスワードに使用可能な文字は英数字と_?!#`$のみです",
                    is_warning: true,
                    is_top: true,
                  });
                }
              }}
            />
          </Password_input_box>

          <Change_user_info_button
            onPress={() => {
              check_and_post();
            }}
          >
            <Change_user_info_button_text>
              変更を送信
            </Change_user_info_button_text>
          </Change_user_info_button>
        </Change_user_info_box>
      </Main_base>
      {out_of_main}
    </View>
  );
}

export { Change_user_info_page, Change_password_page };
