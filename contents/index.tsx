import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import {
  site_url,
  Main_base,
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
  navi_props,
  Image_with_aspect_ratio,
  Riyoukiyaku_comp,
  Main_base_no_footer,
  jump_with_prams,
} from "./parts";
import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect,CommonActions } from "@react-navigation/native";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const Header_image_box = styled.TouchableOpacity`
  position: relative;
  top: ${v_w(0)}px;
  left: ${v_w(0.0)}px;
  width: ${v_w(100)}px;
  height: ${v_w(40)}px;
  width: 100%;
  height: 100%;
`;

const Header_image = styled.Image`
  width: 100%;
  height: 100%;
`;

// 使用例
let p_flag = false;
function Index({ navigation }: navi_props) {
  let not_first_boot_flag = SecureStore.getItem("not_first_boot_flag");
  if (not_first_boot_flag) {
    useFocusEffect(
      useCallback(() => {
        //jump_with_prams("Search_page",{from_boot:true},navigation)
        return () => {
          //SecureStore.deleteItemAsync("not_first_boot_flag")
        };
      }, [])
    );
    useEffect(() => {
      const resetAction = CommonActions.reset({
        index: 0, // 初期スタックのインデックス
        routes: [{ name: 'Search_page', params: {} }],
      });
      navigation.dispatch(resetAction);
      //jump_with_prams("Search_page",{from_boot:true},navigation)
    }, []);
    return <View></View>;
  } else {
    const Login_select_box = styled.View`
      position: absolute;
      min-height: ${v_w(10)}px;
      left: 3%;
      bottom: ${v_w(0)}px;
      width: 94%;
      background-color: transparent;
    `;

    const Login_select_option = styled(General_button)`
      top: ${v_w(0)}px;
      width: ${v_w(60)}px;
      height: ${v_w(8.0)}px;
      border-radius: ${v_w(1.0)}px;
      margin-top: ${v_w(0)}px;
      margin-bottom: ${v_w(3)}px;
      border-radius: ${v_w(2.0)}px;
      background-color: #ffffff;
      border-color: #41717c;
      border-width: ${v_w(0.6)}px;
      margin-right: auto;
      margin-left: auto;
    `;

    const Login_select_option_text = styled.Text`
      text-align: center;
      font-size: ${v_w(4)}px;
      height: ${v_w(8.0)}px;
      margin-top: ${v_w(-0.7)}px;
      line-height: ${v_w(8.0)}px;
      color: #41717c;
    `;
    const [out_of_main, setout_of_main] = useState(<View />);
    function sign_up_as_guest() {
      if (p_flag == false) {
        p_flag = true;
        let uuid = get_uniqueid();
        let request_json_data = {
          username: "",
          password: "",
          mailaddress: "",
          guest_flag: "y",
          device_unique_id: uuid,
        };
        fetch(site_url + "signup/process/app/", {
          method: "post",
          headers: {
            "Content-Type": "application/json", //JSON形式のデータのヘッダー
          },
          body: JSON.stringify(request_json_data),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data["result"] == "success") {
              SecureStore.setItem("user_id", data["user_id"]);
              SecureStore.setItem("session_id_1", data["session_id_1"]);
              SecureStore.setItem("session_id_2", data["session_id_2"]);
              SecureStore.setItem("secure_deviceid", uuid); //何故かいる
              SecureStore.setItem("not_first_boot_flag", "n");
              p_flag = false;
              const resetAction = CommonActions.reset({
                index: 0, // 初期スタックのインデックス
                routes: [{ name: 'Search_page', params: {} }],
              });
              navigation.dispatch(resetAction);
            } else if (data["result"] == "username_overlap") {
              p_flag = false;
              showalert(
                "ニックネーム重複",
                "既に存在するニックネームです\n\nニックネームを別の物に変えてください"
              );
            } else if (data["result"] == "mailaddress_overlap") {
              p_flag = false;
              showalert(
                "メールアドレス重複",
                "既に使用されているメールアドレスです\n\n登録した覚えがない場合は運営に連絡してください"
              );
            } else {
              console.log(data);
              p_flag = false;
              showalert(
                "エラー",
                "エラーコード:トラックボールはブラウジングするだけなら快適\n\n読み込み直したした後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
              );
            }
          })
          .catch((error: any) => {
            console.log(error);
            p_flag = false;
            showalert(
              "通信エラー",
              "エラーコード:ドット絵×電車の風景は最高\n\n通信状況が問題ないことを確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
            );
          });
      }
    }

    const Ddd = styled.Image`
      width: ${v_w(100)}px;
      height: ${v_w((100 * 4095) / 3196)}px;
      position: absolute;
      bottom: 0px;
    `;

    const ASDDD = React.memo(({}) => {
      return <Ddd source={require("../media/IMG_1416.png")} />;
    });

    return (
      <View>
        <ASDDD />
        <View>
          <Main_base_no_footer
            navigation={navigation}
            background_transparent={true}
          >
            <Login_select_box>
              <Login_select_option
                onPress={() => {
                  setout_of_main(
                    <Riyoukiyaku_comp
                      selectable={true}
                      agree_event={sign_up_as_guest}
                      deny_event={() => {
                        setout_of_main(<View />);
                      }}
                    />
                  );
                }}
              >
                <Login_select_option_text>
                  {"すぐに始める(ゲストユーザー)"}
                </Login_select_option_text>
              </Login_select_option>
              <Login_select_option
                onPress={() => {
                  SecureStore.setItem("not_first_boot_flag", "y");
                  navigation.navigate("Signup_page");
                }}
              >
                <Login_select_option_text>
                  {"登録して始める"}
                </Login_select_option_text>
              </Login_select_option>
              <Login_select_option
                onPress={() => {
                  SecureStore.setItem("not_first_boot_flag", "y");
                  navigation.navigate("Login_page");
                }}
              >
                <Login_select_option_text>ログイン</Login_select_option_text>
              </Login_select_option>
              <Login_select_option
                onPress={() => {
                  SecureStore.setItem("not_first_boot_flag", "y");
                  navigation.navigate("Search_page");
                }}
              >
                <Login_select_option_text>
                  ログインなしで始める
                </Login_select_option_text>
              </Login_select_option>
            </Login_select_box>
          </Main_base_no_footer>
          {out_of_main}
        </View>
      </View>
    );
  }
}

export default Index;
