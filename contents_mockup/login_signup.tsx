import {
  is_android,
  site_url,
  Main_base,
  General_button,
  General_input,
  showalert,
  get_uniqueid,
  super_reload,
  navi_props,
  navi_param_props,
  General_text,
  alert_buttom,
  jump_with_prams,
  get_session_datas,
  display_session_error,
  Riyoukiyaku_comp,
  flexble_px,
  flexble_font_size,
  the_fetch,
  Main_base_no_footer,
} from "./parts";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useFocusEffect, CommonActions } from "@react-navigation/native";
import styled from "styled-components/native";
import * as SecureStore from "expo-secure-store";

const Login_box = styled.View`
  position: relative;
  top: ${flexble_px(24)};
  left: 5%;
  width: 90%;
  display: block;
  padding-top: ${flexble_px(20)};
  border-radius: ${flexble_px(20)};
  background-color: #ffffff;
  text-align: center;
  margin-bottom: ${flexble_px(40)};
`;

const H3_login_box = styled.View`
  width: 100%;
  border-bottom-color: #41717c;
  border-bottom-width: 5px;
  padding-bottom: ${flexble_px(15)};
  margin-bottom: ${flexble_px(45)};
`;

const H3_login = styled(General_text)`
  color: #5a9fa6;
  ${flexble_font_size(32)}
  text-align: center;
`;

const Mailaddress_input_box = styled.View`
  text-align: center;
  width: 80%;
  left: 10%;
  margin-bottom: ${flexble_px(40)};
`;

const Mailaddress_input = styled(General_input)`
  border-width: 0px;
  width: 100%;
  background-color: #f5f5f5;
  padding-left: ${flexble_px(24)};
  height: ${flexble_px(60)};
  border-radius: ${is_android ? flexble_px(30) : `50%`};
  ${flexble_font_size(24)}
  border-color: #41717c;
`;

const Password_input_box = styled.View`
  text-align: center;
  width: 80%;
  left: 10%;
  margin-bottom: ${flexble_px(40)};
`;

const Password_input = styled.TextInput.attrs({
  secureTextEntry: true,
  autoCapitalize: "none",
})`
  width: 100%;
  background-color: #f5f5f5;
  padding-left: ${flexble_px(24)};
  height: ${flexble_px(60)};
  border-radius: ${is_android ? flexble_px(30) : `50%`};
  ${flexble_font_size(24)}
  color: #555555;
  border-color: #41717c;
`;
const Login_button = styled(General_button)`
  width: ${flexble_px(300)};
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  margin-bottom: ${flexble_px(150)};
  height: ${flexble_px(60)};
  border-radius: ${is_android ? flexble_px(30) : `50%`};
  background-color: #ffe599;
  border-color: #ffdf80;
  border-width: 5px;
`;
const Login_button_text = styled(General_text)`
  text-align: center;
  color: #5a9fa6;
  line-height: ${flexble_px(60)};
  margin-top: -5px;
  ${flexble_font_size(32)}
`;

const Login_to_signup = styled(General_button)`
  position: absolute;
  bottom: 0px;
  height: ${flexble_px(60)};
  width: ${flexble_px(240)};
  border-width: 0px;
  background-color: #598994;
  border-radius: 0px;
`;

const Login_to_signup_text = styled(General_text)`
  text-align: center;
  color: #ffffff;
  ${flexble_font_size(28)}
  line-height: ${flexble_px(60)};
`;

const username_exclusion_pattern = />|<| |　|\u200b|&lt;|,|\n|\r|\t/g;
const mailaddress_patteen =
  /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}/;
const password_patteen =
  /^(([a-zA-Z0-9]|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\-|\=|\[|\]|\{|\}|\||\;|\:|\'|\,|\.|\<|\>|\?|\/|\~|\`)+)$/;

var pre_inputed_password = "";
var pre_inputed_mailaddress = "";

const Login_page: React.FC<navi_param_props> = ({ route, navigation }) => {
  const [out_of_main, setout_of_main] = useState(<View />);
  const [signup_processing_flag, setsignup_processing_flag] = useState(false);
  const [password, setpassword] = useState("");
  const [mailaddress, setmailaddress] = useState("");
  const login = () => {
    if (signup_processing_flag == false) {
      if (!mailaddress_patteen.test(mailaddress)) {
        showalert("メールアドレスが不正です");
      } else if (!password_patteen.test(password)) {
        showalert("パスワードが不正です");
      } else {
        setsignup_processing_flag(true);
        let uuid = get_uniqueid();
        let request_json_data = {
          password: password,
          mailaddress: mailaddress,
          device_unique_id: uuid,
        };
        fetch(site_url + "login_process/app/", {
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
              SecureStore.setItem("not_first_boot_flag", "y");
              setsignup_processing_flag(false);
              const resetAction = CommonActions.reset({
                index: 0, // 初期スタックのインデックス
                routes: [{ name: "My_page", params: {} }],
              });
              navigation.dispatch(resetAction);
            } else if (data["result"] == "incorrect_password") {
              setsignup_processing_flag(false);
              showalert("", "パスワードが間違っています");
            } else if (data["result"] == "incorrect_mailaddress") {
              setsignup_processing_flag(false);
              showalert("", "メールアドレスが間違っています");
            } else {
              setsignup_processing_flag(false);
              console.log(data);
              showalert(
                "エラー",
                "エラーコード:魚沼産コシヒカリは別格\n\n読み込み直したした後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
              );
            }
          })
          .catch((error: any) => {
            console.log(error);
            setsignup_processing_flag(false);
            showalert(
              "通信エラー",
              "エラーコード:オンライン対戦ゲームは相手を一方的に殴ってるときが一番楽しい\n\n通信状況が問題ないことを確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
            );
          });
      }
    }
  };
  var no_footer_flag = false;
  if (route.params) {
    if (route.params.no_footer_flag) {
      no_footer_flag = route.params.no_footer_flag;
    }
  }
  if (no_footer_flag) {
    return (
      <View>
        <Main_base_no_footer>
          <Login_box>
            <H3_login_box>
              <H3_login>ログイン</H3_login>
            </H3_login_box>
            <Mailaddress_input_box>
              <Mailaddress_input
                keyboardType={"email-address"}
                autoComplete={"email"}
                autoCapitalize={"none"}
                autoCorrect={false}
                placeholder="メールアドレス"
                value={mailaddress}
                onChangeText={(inputed_mailaddress: string) => {
                  pre_inputed_mailaddress = inputed_mailaddress;
                  setmailaddress(inputed_mailaddress);
                }}
              ></Mailaddress_input>
            </Mailaddress_input_box>
            <Password_input_box>
              <Password_input
                placeholder="パスワード"
                value={password}
                onChangeText={(inputed_password: string) => {
                  if (
                    password_patteen.test(inputed_password) ||
                    inputed_password.length == 0
                  ) {
                    pre_inputed_password = inputed_password;
                    setpassword(inputed_password);
                  } else {
                    console.log(inputed_password);
                    alert_buttom({
                      setout_of_main: setout_of_main,
                      text: "パスワードに使用可能な文字は英数字と!@#$%^&*()_+-=[]{}|;:',.<>?/~`のみです",
                      is_warning: true,
                      is_top: true,
                    });
                    setpassword(pre_inputed_password);
                  }
                }}
              ></Password_input>
            </Password_input_box>
            <Login_button
              onPress={() => {
                login();
              }}
            >
              <Login_button_text>ログイン</Login_button_text>
            </Login_button>
            <Login_to_signup
              onPress={() => {
                jump_with_prams("Signup_page",{no_footer_flag:no_footer_flag},navigation);
              }}
            >
              <Login_to_signup_text>登録はこちら</Login_to_signup_text>
            </Login_to_signup>
          </Login_box>
        </Main_base_no_footer>
        {out_of_main}
      </View>
    );
  }
  return (
    <View>
      <Main_base navigation={navigation}>
        <Login_box>
          <H3_login_box>
            <H3_login>ログイン</H3_login>
          </H3_login_box>
          <Mailaddress_input_box>
            <Mailaddress_input
              keyboardType={"email-address"}
              autoComplete={"email"}
              autoCapitalize={"none"}
              autoCorrect={false}
              placeholder="メールアドレス"
              value={mailaddress}
              onChangeText={(inputed_mailaddress: string) => {
                pre_inputed_mailaddress = inputed_mailaddress;
                setmailaddress(inputed_mailaddress);
              }}
            ></Mailaddress_input>
          </Mailaddress_input_box>
          <Password_input_box>
            <Password_input
              placeholder="パスワード"
              value={password}
              onChangeText={(inputed_password: string) => {
                if (
                  password_patteen.test(inputed_password) ||
                  inputed_password.length == 0
                ) {
                  pre_inputed_password = inputed_password;
                  setpassword(inputed_password);
                } else {
                  console.log(inputed_password);
                  alert_buttom({
                    setout_of_main: setout_of_main,
                    text: "パスワードに使用可能な文字は英数字と!@#$%^&*()_+-=[]{}|;:',.<>?/~`のみです",
                    is_warning: true,
                    is_top: true,
                  });
                  setpassword(pre_inputed_password);
                }
              }}
            ></Password_input>
          </Password_input_box>
          <Login_button
            onPress={() => {
              login();
            }}
          >
            <Login_button_text>ログイン</Login_button_text>
          </Login_button>
          <Login_to_signup
            onPress={() => {

              jump_with_prams("Signup_page",{no_footer_flag:no_footer_flag},navigation);
            }}
          >
            <Login_to_signup_text>登録はこちら</Login_to_signup_text>
          </Login_to_signup>
        </Login_box>
      </Main_base>
      {out_of_main}
    </View>
  );
};

const Signup_box = styled.View`
  position: relative;
  top: ${flexble_px(24)};
  left: 5%;
  width: 90%;
  display: block;
  padding-top: ${flexble_px(20)};
  border-radius: 20px;
  background-color: #ffffff;
  text-align: center;
`;

const Username_input_box = styled.View`
  text-align: center;
  width: 80%;
  left: 10%;
`;

const Username_input = styled(General_input)`
  border-width: 0px;
  width: 100%;
  background-color: #f5f5f5;
  padding-left: 24px;
  height: ${flexble_px(70)};
  border-radius: ${flexble_px(35)};
  ${flexble_font_size(24)}
  border-color: #41717c;
  margin_bottom: ${flexble_px(40)};
`;

const Riyouki_link = styled(General_button)`
  margin-left: auto;
  margin-right: auto;
`;

const Riyouki_link_text = styled(General_text)`
  text-align: center;
  color: #41717c;
  ${flexble_font_size(24)}
`;

const Signup_button = styled(Login_button)`
  width: 85%;
`;

const Signup_page: React.FC<navi_param_props> = ({ route, navigation }) => {
  var no_footer_flag = false;
  if (route.params) {
    if (route.params.no_footer_flag) {
      no_footer_flag = route.params.no_footer_flag;
    }
  }
  const [out_of_main, setout_of_main] = useState(<View />);
  const [signup_processing_flag, setsignup_processing_flag] = useState(false);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [confirmation_password, setconfirmation_password] = useState("");
  const [mailaddress, setmailaddress] = useState("");
  const signup = () => {
    if (signup_processing_flag == false) {
      if (password.length < 6) {
        alert_buttom({
          setout_of_main: setout_of_main,
          text: "パスワードは6文字以上です",
          is_warning: true,
          is_top: true,
        });
      }
      if (!mailaddress_patteen.test(mailaddress)) {
        alert_buttom({
          setout_of_main: setout_of_main,
          text: "メールアドレスが不正です",
          is_warning: true,
          is_top: true,
        });
      } else if (!password_patteen.test(password)) {
        showalert("パスワードが不正です");
      } else {
        setout_of_main(
          <Riyoukiyaku_comp
            selectable={true}
            agree_event={() => {
              setsignup_processing_flag(true);
              let uuid = get_uniqueid();
              let request_json_data = {
                username: username,
                password: password,
                mailaddress: mailaddress,
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
                    SecureStore.setItem("not_first_boot_flag", "y");
                    setsignup_processing_flag(false);
                    const resetAction = CommonActions.reset({
                      index: 0, // 初期スタックのインデックス
                      routes: [{ name: "Search_page", params: {} }],
                    });
                    navigation.dispatch(resetAction);
                  } else if (data["result"] == "username_overlap") {
                    setsignup_processing_flag(false);
                    showalert(
                      "ニックネーム重複",
                      "既に存在するニックネームです\n\nニックネームを別の物に変えてください"
                    );
                  } else if (data["result"] == "mailaddress_overlap") {
                    setsignup_processing_flag(false);
                    showalert(
                      "メールアドレス重複",
                      "既に使用されているメールアドレスです\n\n登録した覚えがない場合は運営に連絡してください"
                    );
                  } else {
                    console.log(data);
                    setsignup_processing_flag(false);
                    showalert(
                      "エラー",
                      "読み込み直したした後も同じエラーが出るときは運営に伝えてください。"
                    );
                  }
                })
                .catch((error: any) => {
                  console.log(error);
                  setsignup_processing_flag(false);
                  showalert(
                    "通信エラー",
                    "通信状況が問題ないことを確認した後も同じエラーが出るときは運営に共に伝えてください。"
                  );
                });
            }}
            deny_event={() => {
              setout_of_main(<View />);
            }}
          />
        );
      }
    }
  };
  if (no_footer_flag) {
    return (
      <View>
        <Main_base_no_footer>
          <Signup_box>
            <H3_login_box>
              <H3_login>登録</H3_login>
            </H3_login_box>
            <Username_input_box>
              <Username_input
                placeholder="ニックネーム"
                value={username}
                max_length={30}
                onChangeText={(inputed_username: string) => {
                  let new_username = inputed_username;
                  if (username_exclusion_pattern.test(inputed_username)) {
                    new_username = inputed_username.replace(/</g, "＜");
                    new_username = new_username.replace(/>/g, "＞");
                    new_username = new_username.replace(/\&lt/g, "＆lt");
                    new_username = new_username.replace(/\&gt/g, "＆gt");
                    if (username_exclusion_pattern.test(new_username)) {
                      new_username = new_username.replace(
                        username_exclusion_pattern,
                        ""
                      );
                      alert_buttom({
                        setout_of_main: setout_of_main,
                        text: "ニックネームにその文字は使えません",
                        is_warning: true,
                        is_top: true,
                      });
                    }
                  }
                  setusername(new_username);
                }}
              />
            </Username_input_box>
            <Mailaddress_input_box>
              <Mailaddress_input
                keyboardType={"email-address"}
                autoComplete={"email"}
                autoCorrect={false}
                autoCapitalize={"none"}
                placeholder="メールアドレス"
                value={mailaddress}
                onChangeText={(inputed_mailaddress: string) => {
                  setmailaddress(inputed_mailaddress);
                }}
              ></Mailaddress_input>
            </Mailaddress_input_box>
            <Password_input_box>
              <Password_input
                placeholder="パスワード"
                value={password}
                max_length={255}
                onChangeText={(inputed_password: string) => {
                  if (
                    password_patteen.test(inputed_password) ||
                    inputed_password.length == 0
                  ) {
                    setpassword(inputed_password);
                  } else {
                    console.log(inputed_password);
                    alert_buttom({
                      setout_of_main: setout_of_main,
                      text: "パスワードに使用可能な文字は英数字と!@#$%^&*()_+-=[]{}|;:',.<>?/~`のみです",
                      is_warning: true,
                      is_top: true,
                    });
                  }
                }}
              ></Password_input>
            </Password_input_box>
            <Password_input_box>
              <Password_input
                placeholder="パスワード(確認)"
                value={confirmation_password}
                onChangeText={(inputed_password: string) => {
                  if (
                    password_patteen.test(inputed_password) ||
                    inputed_password.length == 0
                  ) {
                    setconfirmation_password(inputed_password);
                  } else {
                    alert_buttom({
                      setout_of_main: setout_of_main,
                      text: "パスワードに使用可能な文字は英数字と!@#$%^&*()_+-=[]{}|;:',.<>?/~`のみです",
                      is_warning: true,
                      is_top: true,
                    });
                  }
                }}
              ></Password_input>
            </Password_input_box>
            <Riyouki_link
              onPress={() => {
                setout_of_main(
                  <Riyoukiyaku_comp
                    out_event={() => {
                      setout_of_main(<View />);
                    }}
                    selectable={false}
                  />
                );
              }}
            >
              <Riyouki_link_text>利用規約</Riyouki_link_text>
            </Riyouki_link>
            <Signup_button
              onPress={() => {
                signup();
              }}
            >
              <Login_button_text>登録</Login_button_text>
            </Signup_button>
            <Login_to_signup
              onPress={() => {
                jump_with_prams("Login_page",{no_footer_flag:no_footer_flag},navigation);
              }}
            >
              <Login_to_signup_text>ログインはこちら</Login_to_signup_text>
            </Login_to_signup>
          </Signup_box>
        </Main_base_no_footer>
        {out_of_main}
      </View>
    );
  }
  return (
    <View>
      <Main_base navigation={navigation}>
        <Signup_box>
          <H3_login_box>
            <H3_login>登録</H3_login>
          </H3_login_box>
          <Username_input_box>
            <Username_input
              placeholder="ニックネーム"
              value={username}
              max_length={30}
              onChangeText={(inputed_username: string) => {
                let new_username = inputed_username;
                if (username_exclusion_pattern.test(inputed_username)) {
                  new_username = inputed_username.replace(/</g, "＜");
                  new_username = new_username.replace(/>/g, "＞");
                  new_username = new_username.replace(/\&lt/g, "＆lt");
                  new_username = new_username.replace(/\&gt/g, "＆gt");
                  if (username_exclusion_pattern.test(new_username)) {
                    new_username = new_username.replace(
                      username_exclusion_pattern,
                      ""
                    );
                    alert_buttom({
                      setout_of_main: setout_of_main,
                      text: "ニックネームにその文字は使えません",
                      is_warning: true,
                      is_top: true,
                    });
                  }
                }
                setusername(new_username);
              }}
            />
          </Username_input_box>
          <Mailaddress_input_box>
            <Mailaddress_input
              keyboardType={"email-address"}
              autoComplete={"email"}
              autoCorrect={false}
              autoCapitalize={"none"}
              placeholder="メールアドレス"
              value={mailaddress}
              onChangeText={(inputed_mailaddress: string) => {
                setmailaddress(inputed_mailaddress);
              }}
            ></Mailaddress_input>
          </Mailaddress_input_box>
          <Password_input_box>
            <Password_input
              placeholder="パスワード"
              value={password}
              max_length={255}
              onChangeText={(inputed_password: string) => {
                if (
                  password_patteen.test(inputed_password) ||
                  inputed_password.length == 0
                ) {
                  setpassword(inputed_password);
                } else {
                  console.log(inputed_password);
                  alert_buttom({
                    setout_of_main: setout_of_main,
                    text: "パスワードに使用可能な文字は英数字と!@#$%^&*()_+-=[]{}|;:',.<>?/~`のみです",
                    is_warning: true,
                    is_top: true,
                  });
                }
              }}
            ></Password_input>
          </Password_input_box>
          <Password_input_box>
            <Password_input
              placeholder="パスワード(確認)"
              value={confirmation_password}
              onChangeText={(inputed_password: string) => {
                if (
                  password_patteen.test(inputed_password) ||
                  inputed_password.length == 0
                ) {
                  setconfirmation_password(inputed_password);
                } else {
                  alert_buttom({
                    setout_of_main: setout_of_main,
                    text: "パスワードに使用可能な文字は英数字と!@#$%^&*()_+-=[]{}|;:',.<>?/~`のみです",
                    is_warning: true,
                    is_top: true,
                  });
                }
              }}
            ></Password_input>
          </Password_input_box>
          <Riyouki_link
            onPress={() => {
              setout_of_main(
                <Riyoukiyaku_comp
                  out_event={() => {
                    setout_of_main(<View />);
                  }}
                  selectable={false}
                />
              );
            }}
          >
            <Riyouki_link_text>利用規約</Riyouki_link_text>
          </Riyouki_link>
          <Signup_button
            onPress={() => {
              signup();
            }}
          >
            <Login_button_text>登録</Login_button_text>
          </Signup_button>
          <Login_to_signup
            onPress={() => {
              jump_with_prams("Login_page",{no_footer_flag:no_footer_flag},navigation);
            }}
          >
            <Login_to_signup_text>ログインはこちら</Login_to_signup_text>
          </Login_to_signup>
        </Signup_box>
      </Main_base>
      {out_of_main}
    </View>
  );
};

const True_signup_page: React.FC<navi_props> = ({ navigation }) => {
  const [out_of_main, setout_of_main] = useState(<View />);
  const [signup_processing_flag, setsignup_processing_flag] = useState(false);
  const [password, setpassword] = useState("");
  const [confirmation_password, setconfirmation_password] = useState("");
  const [mailaddress, setmailaddress] = useState("");
  return (
    <View>
      <Main_base navigation={navigation}>
        <Login_box>
          <H3_login style={{ marginBottom: 12 }}>本登録</H3_login>
          <Mailaddress_input_box>
            <Mailaddress_input
              keyboardType={"email-address"}
              autoComplete={"email"}
              autoCapitalize={"none"}
              autoCorrect={false}
              placeholder="新しいメールアドレス"
              value={mailaddress}
              onChangeText={(inputed_mailaddress: string) => {
                pre_inputed_mailaddress = inputed_mailaddress;
                setmailaddress(inputed_mailaddress);
              }}
            ></Mailaddress_input>
          </Mailaddress_input_box>
          <Password_input_box>
            <Password_input
              placeholder="新しいパスワード"
              value={password}
              onChangeText={(inputed_password: string) => {
                if (
                  password_patteen.test(inputed_password) ||
                  inputed_password.length == 0
                ) {
                  setpassword(inputed_password);
                } else {
                  alert_buttom({
                    setout_of_main: setout_of_main,
                    text: "パスワードに使用可能な文字は英数字と!@#$%^&*()_+-=[]{}|;:',.<>?/~`のみです",
                    is_warning: true,
                    is_top: true,
                  });
                }
              }}
            ></Password_input>
          </Password_input_box>
          <Password_input_box>
            <Password_input
              placeholder="新しいパスワード(確認)"
              value={confirmation_password}
              onChangeText={(inputed_password: string) => {
                if (
                  password_patteen.test(inputed_password) ||
                  inputed_password.length == 0
                ) {
                  setconfirmation_password(inputed_password);
                } else {
                  alert_buttom({
                    setout_of_main: setout_of_main,
                    text: "パスワードに使用可能な文字は英数字と!@#$%^&*()_+-=[]{}|;:',.<>?/~`のみです",
                    is_warning: true,
                    is_top: true,
                  });
                }
              }}
            ></Password_input>
          </Password_input_box>
          <Login_button
            onPress={() => {
              if (signup_processing_flag == false) {
                if (password.length < 6) {
                  alert_buttom({
                    setout_of_main: setout_of_main,
                    text: "パスワードは6文字以上です",
                    is_warning: true,
                    is_top: true,
                  });
                } else if (!mailaddress_patteen.test(mailaddress)) {
                  showalert("", "メールアドレスが不正です");
                } else if (!password_patteen.test(password)) {
                  showalert("", "パスワードが不正です");
                } else if (password != confirmation_password) {
                  alert_buttom({
                    setout_of_main: setout_of_main,
                    text: "パスワードと確認用パスワードが異なります",
                    is_warning: true,
                    is_top: true,
                  });
                } else {
                  setsignup_processing_flag(true);
                  let request_json_data = {
                    password: password,
                    mailaddress: mailaddress,
                  };
                  request_json_data = Object.assign(
                    get_session_datas(),
                    request_json_data
                  );
                  fetch(site_url + "true_signup/", {
                    method: "post",
                    headers: {
                      "Content-Type": "application/json", //JSON形式のデータのヘッダー
                    },
                    body: JSON.stringify(request_json_data),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data["result"] == "success") {
                        const resetAction = CommonActions.reset({
                          index: 0, // 初期スタックのインデックス
                          routes: [{ name: "My_page", params: {} }],
                        });
                        navigation.dispatch(resetAction);
                      } else if (data["result"] == "incorrect_session") {
                        setsignup_processing_flag(false);
                        display_session_error(navigation);
                      } else if (data["result"] == "mailaddress_overlap") {
                        setsignup_processing_flag(false);
                        showalert(
                          "メールアドレス重複",
                          "既に使用されているメールアドレスです\n\n登録した覚えがない場合は運営に連絡してください"
                        );
                      } else {
                        setsignup_processing_flag(false);
                        showalert(
                          "エラー",
                          "エラーコード:旅行は始発を使う\n\n読み込み直したした後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
                        );
                      }
                    })
                    .catch((error: any) => {
                      console.log(error);
                      setsignup_processing_flag(false);
                      showalert(
                        "通信エラー",
                        "エラーコード:京都府は地味に広い\n\n通信状況が問題ないことを確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
                      );
                    });
                }
              }
            }}
          >
            <Login_button_text>本登録</Login_button_text>
          </Login_button>
        </Login_box>
      </Main_base>
      {out_of_main}
    </View>
  );
};

export {
  Login_page,
  Signup_page,
  True_signup_page,
  password_patteen,
  Password_input,
};
