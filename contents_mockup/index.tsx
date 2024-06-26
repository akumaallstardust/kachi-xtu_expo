import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  Text,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import {
  is_android,
  site_url,
  Main_base,
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
  flexble_px,
  flexble_font_size,
} from "./parts";
import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect, CommonActions } from "@react-navigation/native";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

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
        routes: [{ name: "Search_page", params: {} }],
      });
      navigation.dispatch(resetAction);
      //jump_with_prams("Search_page",{from_boot:true},navigation)
    }, []);
    return <View></View>;
  } else {
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
                routes: [{ name: "Search_page", params: {} }],
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
                "読み込み直したした後も同じエラーが出るときは運営に伝えてください。"
              );
            }
          })
          .catch((error: any) => {
            console.log(error);
            p_flag = false;
            showalert(
              "通信エラー",
              "通信状況が問題ないことを確認した後も同じエラーが出るときは運営に伝えてください。"
            );
          });
      }
    }

    const { width, height } = useWindowDimensions();
    const Login_select_box = styled.View`
      position: absolute;
      left: 3%;
      bottom: 0px;
      width: 94%;
      background-color: transparent;
    `;

    const Login_select_option = styled(General_button)`
      top: 0px;
      width: 60%;
      min-width: ${flexble_px(400)};
      height: ${flexble_px(60)};
      border-radius: ${is_android ? `30px` : `50%`};
      margin-top: 0px;
      margin-bottom: 20px;
      background-color: #ffffff;
      border-color: #41717c;
      border-width: 5px;
      margin-right: auto;
      margin-left: auto;
    `;

    const Login_select_option_text = styled.Text`
      text-align: center;
      ${flexble_font_size(28)}
      margin-top: -5px;
      line-height: ${flexble_px(60)};
      color: #41717c;
    `;
    const [out_of_main, setout_of_main] = useState(<View />);

    return (
      <View style={{ width: "100%", height: "100%" }}>
        <View style={{ width: "100%", height: "100%" }}>
          <View
            style={{
              marginRight: "auto",
              marginLeft: "auto",
              marginTop: "auto",
              marginBottom: "auto",
              width: "100%",
              height: "100%",
              aspectRatio: 740 / 1282,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <Image
              style={{
                height: "100%",
                width: "100%",
              }}
              source={require("../media/IMG_1416.png")}
            />
          </View>
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
                jump_with_prams("Signup_page",{no_footer_flag:true},navigation);
              }}
            >
              <Login_select_option_text>
                {"登録して始める"}
              </Login_select_option_text>
            </Login_select_option>
            <Login_select_option
              onPress={() => {
                jump_with_prams("Login_page",{no_footer_flag:true},navigation);
              }}
            >
              <Login_select_option_text>ログイン</Login_select_option_text>
            </Login_select_option>
            <Login_select_option
              onPress={() => {
                setout_of_main(
                  <Riyoukiyaku_comp
                    selectable={true}
                    agree_event={() => {
                      SecureStore.setItem("not_first_boot_flag", "n");
                      navigation.navigate("Search_page");
                    }}
                    deny_event={() => {
                      setout_of_main(<View />);
                    }}
                  />
                );
              }}
            >
              <Login_select_option_text>
                ログインなしで始める
              </Login_select_option_text>
            </Login_select_option>
          </Login_select_box>
        </View>
        {out_of_main}
      </View>
    );
  }
}

export default Index;
