import {
  site_url,
  Main_base,
  v_w,
  General_button,
  General_input,
  showalert,
  get_uniqueid,
  get_user_id,
  navi_props,
  get_session_datas,
  log_out,
  General_text,
  Gray_out_page,
  alert_buttom,
  display_session_error,
  super_reload,
  Riyoukiyaku_comp,
  flexble_font_size,
  flexble_px,
  jump_with_prams,
  re_first_boot,
  width,
  height,
} from "./parts";
import {
  Dimensions,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
  //useWindowDimensions,
  Linking,
} from "react-native";
import { Password_input } from "./login_signup";
import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components/native";
let user_id = get_user_id();
const My_page_box = styled.View`
  position: relative;
  top: 0px;
  left: 0%;
  width: 100%;
  padding-top: 0px;
  border-radius: 20px;
  border-top-right-radius: 0px;
  background-color: #ffffff;
  text-align: left;
  padding-bottom: 0px;
  margin-bottom: 40px;
`;

const User_name_icon_box = styled.View`
  position: relative;
  width: 100%;
  margin-bottom: 0px;
  max-height: 200px;
`;

const User_page_icon_box = styled.View`
  top: 0px;
  left: 0px;
  width: 33%;
  max-width: 200px;
  aspect-ratio: 1;
`;

const User_page_icon_image = styled.Image`
  width: 100%;
  aspect-ratio: 1;
`;

const User_page_name = styled(General_text)`
  position: absolute;
  color: #555555;
  ${flexble_font_size(28)}
  left: 35%;
  top: 15px;
  width: 65%;
`;

const User_page_user_id = styled(General_text)`
  position: absolute;
  ${flexble_font_size(20)}
  right: ${v_w(2.0)}px;
  bottom: ${v_w(2.0)}px;
  color: #aaa;
`;

const User_page_profile_box = styled.View`
  width: 100%;
  border-top-color: #e0e0e0;
  border-top-width: 1px;
  border-bottom-color: #e0e0e0;
  border-bottom-width: 1px;
  margin-bottom: 0px;
  padding-left: 3%;
  min-height: 40px;
`;

const User_page_profile_text = styled(General_text)`
  color: #555555;
  ${flexble_font_size(24)}
`;

const My_page_option = styled(General_button)`
  height: ${flexble_px(80)}
  padding-left: 20px;
  position: relative;
  margin-top: 20px;
  background-color: #f3f3f3;
  border-bottom-color: #e0e0e0;
  border-bottom-width: 1px;
`;

const My_page_option_text = styled(General_text)`
  color: #598994;
  ${flexble_font_size(32)}
  line-height: ${flexble_px(80)}
`;

function My_page({ navigation }: navi_props) {
  user_id = get_user_id();
  const [username, setusername] = useState("読み込み中");
  const [user_profile, setuser_profile] = useState(<View />);
  const [options, setoptions] = useState([
    <My_page_option
      key={"View_history_pawqeqqewge"}
      onPress={() => {
        navigation.navigate("View_history_page");
      }}
    >
      <My_page_option_text>閲覧履歴</My_page_option_text>
    </My_page_option>,
    <My_page_option
      key={"My_poweqweqewqest_page"}
      onPress={() => {
        navigation.navigate("My_post_page");
      }}
    >
      <My_page_option_text>投稿作品</My_page_option_text>
    </My_page_option>,
    <My_page_option
      key={"User_pqweqweqeagesssss"}
      onPress={() => {
        jump_with_prams(
          "User_page",
          { user_id: user_id, init_display_option: "user" },
          navigation
        );
      }}
    >
      <My_page_option_text>フォローリスト</My_page_option_text>
    </My_page_option>,
    <My_page_option
      key={"Chanqweqeqweqge_user_info_page"}
      onPress={() => {
        navigation.navigate("Change_user_info_page");
      }}
    >
      <My_page_option_text>ユーザー情報変更</My_page_option_text>
    </My_page_option>,
    <My_page_option
      key={"Changeqweqeqewq_password_page"}
      onPress={() => {
        navigation.navigate("Change_password_page");
      }}
    >
      <My_page_option_text>パスワード変更</My_page_option_text>
    </My_page_option>,
    <My_page_option
      key={"logqeqeqweqedqout"}
      onPress={() => {
        log_out(navigation, true);
      }}
    >
      <My_page_option_text>ログアウト</My_page_option_text>
    </My_page_option>,
  ]);
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
            if (data["user_profile"] == "") {
              setuser_profile(
                <User_page_profile_box>
                  <User_page_profile_text>
                    {"プロフィールが設定されていません"}
                  </User_page_profile_text>
                </User_page_profile_box>
              );
            } else {
              setuser_profile(
                <User_page_profile_box>
                  <User_page_profile_text>
                    {data["user_profile"]}
                  </User_page_profile_text>
                </User_page_profile_box>
              );
            }
            if (data["guest_flag"] == "y") {
              setoptions([
                <My_page_option
                  key={"View_hiwqeqewqewqeqweqewstory_page"}
                  onPress={() => {
                    navigation.navigate("View_history_page");
                  }}
                >
                  <My_page_option_text>閲覧履歴</My_page_option_text>
                </My_page_option>,
                <My_page_option
                  key={"My_pqeqweqweqeqost_page"}
                  onPress={() => {
                    navigation.navigate("My_post_page");
                  }}
                >
                  <My_page_option_text>投稿作品</My_page_option_text>
                </My_page_option>,
                <My_page_option
                  key={"Useqweqeqwedr_page"}
                  onPress={() => {
                    jump_with_prams(
                      "User_page",
                      { user_id: user_id, init_display_option: "user" },
                      navigation
                    );
                  }}
                >
                  <My_page_option_text>フォローリスト</My_page_option_text>
                </My_page_option>,
                <My_page_option
                  key={"Chanqeqweqeqeqweqweqge_user_info_page"}
                  onPress={() => {
                    navigation.navigate("Change_user_info_page");
                  }}
                >
                  <My_page_option_text>ユーザー情報変更</My_page_option_text>
                </My_page_option>,
                <My_page_option
                  key={"True_sigqweqweqeqwenup_page"}
                  onPress={() => {
                    navigation.navigate("True_signup_page");
                  }}
                >
                  <My_page_option_text>本登録</My_page_option_text>
                </My_page_option>,
                <My_page_option
                key={23423423424}
                  onPress={() => {
                    showalert(
                      "警告",
                      "ゲストユーザーの状態でログアウトすると二度とログインできません\n\n本当にログアウトしますか",
                      "はい",
                      "いいえ"
                    ).then((result: any) => {
                      if (result == "はい") {
                        log_out(navigation);
                      }
                    });
                  }}
                >
                  <My_page_option_text>ログアウト</My_page_option_text>
                </My_page_option>,
              ]);
            }
          } else {
            showalert(
              "エラー",
              "エラーコード:新潟駅の新幹線ホームの無効印は豪華\n\nページを読み込み直した後も確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
            );
          }
        })
        .catch((error) => {
          showalert(
            "通信エラー",
            "エラーコード:金がない　金がないから　金がない\n\n通信状況が問題ないことを確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
          );
        });
    } else {
      navigation.navigate("Login_page");
    }
  }, []); // 空の依存配列を渡すことで、コンポーネントのマウント時にのみ実行されます

  return (
    <Main_base navigation={navigation}>
      <My_page_box>
        <User_name_icon_box>
          <User_page_icon_box>
            <User_page_icon_image
              source={{
                uri: site_url + `media/user_icons/user_icon_${user_id}.png`,
              }}
            />
          </User_page_icon_box>
          <User_page_name>{username}</User_page_name>
          <User_page_user_id>{`ID : ${user_id}`}</User_page_user_id>
        </User_name_icon_box>
        {user_profile}
        {options}
      </My_page_box>
    </Main_base>
  );
}

type user_page_props = {
  route: any;
  navigation: any;
};

const Hoge = () => {
  console.log("hoge");
  //const { width, height } = useWindowDimensions();
  const Hoge_hoge = () => {
    console.log("hoge_hoge");
    return (
      <View style={{ width: width, height: height }}>
        <Text>オールスターダスト計画遂行</Text>
      </View>
    );
  };
  return <Hoge_hoge />;
};

let user_followed_user_dict_list: { id: number; name: string }[] = [];
let user_post_dict_list: { id: number; title: string }[] = [];

function User_page({ route, navigation }: user_page_props) {
  user_id = get_user_id();
  //const { width, height } = useWindowDimensions();
  if (width >= 500) {
    var User_page_name_u = styled(User_page_name)`
      left: ${width * 0.33 < 200 ? width * 0.35 : 210}px;
    `;
    var User_page_follow_button = styled(General_button)`
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 200px;
      text-align: center;
      max-height: 60px;
      border-width: 0;
      background-color: #5a9fa6;
    `;

    var User_page_follow_button_text = styled(General_text)`
      text-align: center;
      color: white;
      line-height: 60px;
      ${flexble_font_size(28)}
    `;

    var User_page_unfollow_button = styled(User_page_follow_button)`
      background-color: #003366;
    `;

    var User_page_unfollow_button_text = styled(User_page_follow_button_text)`
      color: #d3d3d3;
    `;

    var User_page_report_button = styled(General_button)`
      position: absolute;
      left: ${width * 0.33 < 200 ? width * 0.33 : 200}px;
      bottom: 0px;
      width: 120px;
      text-align: center;
      height: 40px;
      border-width: 1px;
      border-color: #41717c;
      background-color: white;
    `;

    var User_page_report_button_text = styled(General_text)`
      color: #555555;
      text-align: center;
      color: white;
      line-height: 39px;
      ${flexble_font_size(28)}
      color: #41717c;
    `;
    var User_page_option_box = styled.View`
      width: 100%;
      border-top-width: 1px;
      border-bottom-width: 1px;
      border-color: #e0e0e0;
      margin-bottom: 40px;
      min-height: 400px;
    `;

    var User_page_option_box_left = styled.View`
      vertical-align: top;
      position: absolute;
      width: 160px;
      height: 100%;
      left: 0px;
      border-right-width: 1px;
      border-color: #e0e0e0;
    `;

    var User_page_option_left = styled(General_button)`
      width: 100%;
      border-right-width: 1px;
      border-bottom-width: 2px;
      border-color: #e0e0e0;
      height: 80px;
      text-align: center;
      background-color: white;
    `;

    var User_page_option_left_text = styled(General_text)`
      color: #555555;
      line-height: 80px;
      ${flexble_font_size(28)}
      width: 100%;
      text-align: center;
      color: black;
    `;

    var User_page_option_left_selected = styled(User_page_option_left)`
      background-color: #41717c;
    `;

    var User_page_option_left_text_selected = styled(
      User_page_option_left_text
    )`
      color: white;
    `;

    var User_page_option_box_right = styled.View`
      vertical-align: top;
      position: relative;
      width: 100%;
      height: 100%;
      padding-left: 160px;
    `;

    var User_page_listed_title_button = styled(General_button)`
      width: 100%;
      min-height: 60px;
      border-bottom-width: 1px;
      border-color: #e0e0e0;
    `;

    var User_page_listed_title_butto_text = styled(General_text)`
      color: #555555;
      font-weight: bold;
      text-align: left;
      position: relative;
      left: 20px;
      font-size: 24px;
      color: #41717c;
      width: 100%;
    `;

    var User_page_listed_user_box = styled(General_button)`
      width: 100%;
      min-height: 90px;
      padding-right: 90px;
      border-bottom-width: 1px;
      border-color: #e0e0e0;
    `;

    var User_page_listed_user_icon = styled.Image`
      position: absolute;
      width: 88px;
      height: 88px;
      left: 0px;
    `;
    var User_page_listed_username = styled(General_text)`
      color: #555555;
      text-align: left;
      position: relative;
      left: 95px;
      font-size: 24px;
      color: #41717c;
      width: 100%;
    `;
  } else {
    var User_page_name_u = styled(User_page_name)`
      top: 5px;
      left: ${width * 0.33 < 200 ? width * 0.35 : 210}px;
    `;

    var User_follow_report_box = styled.View`
      width: 100%;
      height: 50px;
      padding-right: 90px;
    `;

    var User_page_follow_button = styled(General_button)`
      bottom: 0px;
      right: 0px;
      width: 100%;
      text-align: center;
      border-width: 5px;
      border-color: #ffffff;
      height: 50px;
      background-color: #5a9fa6;
    `;

    var User_page_follow_button_text = styled(General_text)`
      text-align: center;
      color: white;
      margin-top: -5px;
      line-height: 50px;
      font-size: 20px;
    `;

    var User_page_unfollow_button = styled(User_page_follow_button)`
      background-color: #003366;
    `;

    var User_page_unfollow_button_text = styled(User_page_follow_button_text)`
      color: #d3d3d3;
    `;

    var User_page_report_button = styled(General_button)`
      position: absolute;
      right: 5px;
      bottom: 5px;
      width: 80px;
      text-align: center;
      height: 40px;
      border-width: 1px;
      border-color: #41717c;
      background-color: white;
    `;

    var User_page_report_button_text = styled(General_text)`
      color: #555555;
      text-align: center;
      color: white;
      line-height: 40px;
      font-size: 16px;
      color: #41717c;
    `;
    var User_page_option_box = styled.View`
      width: 100%;
      border-top-width: 1px;
      border-bottom-width: 1px;
      border-color: #e0e0e0;
      margin-bottom: ${v_w(5.0)}px;
      min-height: ${v_w(50.0)}px;
    `;

    var User_page_option_box_left = styled.View`
      width: 100%;
      align-items: center;
      min-height: 60px;
      left: 0px;
      flex-direction: row;
      border-right-width: 1px;
      border-color: #e0e0e0;
      justify-content: left;
      flex-wrap: wrap;
    `;

    var User_page_option_left = styled(General_button)`
      width: 50%;
      border-right-width: 1px;
      border-bottom-width: 2px;
      border-color: #e0e0e0;
      height: 60px;
      text-align: center;
      background-color: white;
    `;

    var User_page_option_left_text = styled(General_text)`
      color: #555555;
      line-height: 60px;
      font-size: 20px;
      width: 100%;
      text-align: center;
      color: black;
    `;

    var User_page_option_left_selected = styled(User_page_option_left)`
      background-color: #41717c;
    `;

    var User_page_option_left_text_selected = styled(
      User_page_option_left_text
    )`
      color: white;
    `;

    var User_page_option_box_right = styled.View`
      vertical-align: top;
      position: relative;
      width: 100%;
      height: 100%;
      left: 0%;
      font-size: ${v_w(3.0)}px;
    `;

    var User_page_listed_title_button = styled(General_button)`
      width: 100%;
      min-height: 40px;
      border-bottom-width: 1px;
      border-color: #e0e0e0;
    `;

    var User_page_listed_title_butto_text = styled(General_text)`
      color: #555555;
      font-weight: bold;
      text-align: left;
      position: relative;
      left: 10px;
      font-size: 16px;
      color: #41717c;
      width: 100%;
    `;

    var User_page_listed_user_box = styled(General_button)`
      width: 100%;
      min-height: 60px;
      border-bottom-width: 1px;
      border-color: #e0e0e0;
    `;

    var User_page_listed_user_icon = styled.Image`
      position: absolute;
      width: 58px;
      height: 58px;
      left: 0px;
    `;
    var User_page_listed_username = styled(General_text)`
      color: #555555;
      text-align: left;
      position: relative;
      left: 65px;
      font-size: 16px;
      color: #41717c;
      width: 100%;
    `;
  }
  const User_page_entity = () => {
    let owner_user_id = route.params.user_id;
    const [username, setusername] = useState("読み込み中");
    const [user_profile, setuser_profile] = useState(<View />);
    const [follow_button, setfollow_button] = useState(
      owner_user_id == user_id ? (
        <View />
      ) : (
        <User_page_follow_button
          onPress={() => {
            follow();
          }}
        >
          <User_page_follow_button_text>フォロー</User_page_follow_button_text>
        </User_page_follow_button>
      )
    );
    const [user_page_options_left, setuser_page_options_left] = useState([
      <User_page_option_left_selected
        key={"sel23424423243ect_user"}
        onPress={() => {
          set_option("post");
        }}
      >
        <User_page_option_left_text_selected>
          投稿作品
        </User_page_option_left_text_selected>
      </User_page_option_left_selected>,
      <User_page_option_left 
        key={"select_42424432post"}
        onPress={() => {
          set_option("user");
        }}
      >
        <User_page_option_left_text>フォロー</User_page_option_left_text>
      </User_page_option_left>,
    ]);
    const [user_page_options_right, setuser_page_options_right] = useState(
      <View />
    );
    function set_option(change: string) {
      if (change == "post") {
        setuser_page_options_left([
          <User_page_option_left_selected key={433429287834}
            onPress={() => {
              set_option("post");
            }}
          >
            <User_page_option_left_text_selected>
              投稿作品
            </User_page_option_left_text_selected>
          </User_page_option_left_selected>,
          <User_page_option_left key={4322349887834}
            onPress={() => {
              set_option("user");
            }}
          >
            <User_page_option_left_text>フォローリスト</User_page_option_left_text>
          </User_page_option_left>
        ]);
        setuser_page_options_right(
          <View>
            {user_post_dict_list.length >= 1 ? (
              user_post_dict_list.map((post_data) => (
                <User_page_listed_title_button
                  onPress={() => {
                    jump_with_prams(
                      "Uni_post_page",
                      { content_id: post_data.id },
                      navigation
                    );
                  }}
                  key={"post_" + String(post_data.id)}
                  style={{
                    flex: 1,
                    justifyContent: "center", // 縦方向の中央に配置
                    alignItems: "center",
                  }}
                >
                  <User_page_listed_title_butto_text>
                    {post_data.title}
                  </User_page_listed_title_butto_text>
                </User_page_listed_title_button>
              ))
            ) : (
              <View key={8472687432} />
            )}
          </View>
        );
      } else if (change == "user") {
        setuser_page_options_left([
          <User_page_option_left key={432899287834}
            onPress={() => {
              set_option("post");
            }}
          >
            <User_page_option_left_text>投稿作品</User_page_option_left_text>
          </User_page_option_left>,
          <User_page_option_left_selected key={4987834}
            onPress={() => {
              set_option("user");
            }}
          >
            <User_page_option_left_text_selected>
              フォローリスト
            </User_page_option_left_text_selected>
          </User_page_option_left_selected>
        ]);
        setuser_page_options_right(
          <View>
            {user_followed_user_dict_list.length >= 1 ? (
              user_followed_user_dict_list.map((user_data) => (
                <User_page_listed_user_box
                  key={"user_" + String(user_data.id)}
                  onPress={() => {
                    navigation.navigate("User_page", { user_id: user_data.id });
                  }}
                  style={{
                    flex: 1,
                    justifyContent: "center", // 縦方向の中央に配置
                    alignItems: "center",
                  }}
                >
                  <User_page_listed_user_icon
                    source={{
                      uri:
                        site_url +
                        `media/user_icons/user_icon_mini_${user_data.id}.png`,
                    }}
                  />
                  <User_page_listed_username>
                    {user_data.name}
                  </User_page_listed_username>
                </User_page_listed_user_box>
              ))
            ) : (
              <View />
            )}
          </View>
        );
      }
    }

    async function setup() {
      let init_display_option = "post";
      if (route.params.init_display_option) {
        init_display_option = route.params.init_display_option;
      }
      setuser_page_options_left([
        <User_page_option_left_selected
          onPress={() => {
            set_option("post");
          }}
        >
          <User_page_option_left_text_selected>
            投稿作品
          </User_page_option_left_text_selected>
        </User_page_option_left_selected>,
        <User_page_option_left
          onPress={() => {
            set_option("user");
          }}
        >
          <User_page_option_left_text>フォロー</User_page_option_left_text>
        </User_page_option_left>,
      ]);
      let request_json_data = {
        user_id: String(owner_user_id),
        get_f_f: "y",
        get_posts: "y",
        get_followed_user_name: "y",
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
            if (data["user_profile"] == "") {
              setuser_profile(
                <User_page_profile_box>
                  <User_page_profile_text>
                    {"プロフィールが設定されていません"}
                  </User_page_profile_text>
                </User_page_profile_box>
              );
            } else {
              setuser_profile(
                <User_page_profile_box>
                  <User_page_profile_text>
                    {data["user_profile"]}
                  </User_page_profile_text>
                </User_page_profile_box>
              );
            }

            let followers_list = data["followers"].split(",");
            if (followers_list.includes(String(user_id))) {
              setfollow_button(
                <User_page_unfollow_button
                  onPress={() => {
                    follow();
                  }}
                >
                  <User_page_unfollow_button_text>
                    フォロー解除
                  </User_page_unfollow_button_text>
                </User_page_unfollow_button>
              );
            }
            let user_post_title_list =
              data["amount_of_displayed_post"] == "0"
                ? []
                : data["title_combined"].split("<");
            let user_post_content_id_str_list =
              data["amount_of_displayed_post"] == "0"
                ? []
                : data["content_id_combined"].split("<");
            let new_user_post_dict_list = [];
            for (let i = 0; i < user_post_content_id_str_list.length; i++) {
              new_user_post_dict_list[i] = {
                id: Number(user_post_content_id_str_list[i]),
                title: user_post_title_list[i],
              };
            }
            user_post_dict_list = new_user_post_dict_list;
            let followed_user_user_id_str_list =
              data["followed_users"] == ""
                ? []
                : data["followed_users"].split(",");
            let followed_user_username_list =
              data["followed_username_combined"] != ""
                ? data["followed_username_combined"].split("<")
                : [];
            let new_user_followed_user_dict_list: {
              id: number;
              name: string;
            }[] = [];
            for (let i = 0; i < followed_user_user_id_str_list.length; i++) {
              new_user_followed_user_dict_list[i] = {
                id: Number(followed_user_user_id_str_list[i]),
                name: followed_user_username_list[i],
              };
            }
            user_followed_user_dict_list = new_user_followed_user_dict_list;
            set_option(init_display_option);
          } else {
            showalert(
              "エラー",
              "エラーコード:東京新大阪間の新幹線代が高すぎる\n\n読み込み直しても同じエラーが出るときは運営にエラーコードと共に伝えてください。"
            );
          }
        })
        .catch((error) => {
          console.log(error);
          showalert(
            "通信エラー",
            "エラーコード:アフリカ最大の湖がヴィクトリア湖は琵琶湖の名前がマッカーサー湖のようなもの\n\n通信状況が問題ないことを確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
          );
        });
    }
    useEffect(() => {
      setup();
    }, [owner_user_id]); //空の依存配列を渡すことで、コンポーネントのマウント時にのみ実行されます

    function follow() {
      if(user_id<=0){
        navigation.navigate("Signup_page");
      }
      else{
        let request_json_data = {
          followed_user_id: String(owner_user_id),
        };
        request_json_data = Object.assign(request_json_data, get_session_datas());
        fetch(site_url + "user_follow_process/app/", {
          method: "post",
          headers: {
            "Content-Type": "application/json", //JSON形式のデータのヘッダー
          },
          body: JSON.stringify(request_json_data),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data["result"] == "success") {
              if (data["change"] == "followed") {
                setfollow_button(
                  <User_page_unfollow_button
                    onPress={() => {
                      follow();
                    }}
                  >
                    <User_page_unfollow_button_text>
                      フォロー解除
                    </User_page_unfollow_button_text>
                  </User_page_unfollow_button>
                );
              } else if (data["change"] == "unfollowed") {
                setfollow_button(
                  <User_page_follow_button
                    onPress={() => {
                      follow();
                    }}
                  >
                    <User_page_follow_button_text>
                      フォロー
                    </User_page_follow_button_text>
                  </User_page_follow_button>
                );
              }
            } else if (data["result"] == "myself_follow_error") {
              showalert("", "自分自身をフォローできません");
            } else {
              showalert("エラー","エラーコード:0000000000\n\nページを読み込み直した後も確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。");
            }
          })
          .catch((error) => {
            showalert(
              "通信エラー",
              "エラーコード:晴れて地崩れる\n\n通信状態を確認してください\n\n通信状態を確認した後もこのメッセージが表示される場合はエラーコードと共に運営に伝えてください。"
            );
            console.log(error);
          });
      }
    }
    if (width >= 500) {
      return (
        <Main_base navigation={navigation}>
          <My_page_box>
            <User_name_icon_box>
              <User_page_icon_box>
                <User_page_icon_image
                  source={{
                    uri:
                      site_url +
                      `media/user_icons/user_icon_${owner_user_id}.png`,
                  }}
                />
              </User_page_icon_box>
              {owner_user_id == user_id ? (
                <View />
              ) : (
                <User_page_report_button
                  onPress={() => {
                    navigation.navigate("Report_page", {
                      subject_category: "user",
                      subject_id: owner_user_id,
                    });
                  }}
                >
                  <User_page_report_button_text>
                    通報
                  </User_page_report_button_text>
                </User_page_report_button>
              )}
              <User_page_name_u>{username}</User_page_name_u>
              {follow_button}
            </User_name_icon_box>
            {user_profile}
            <User_page_option_box>
              <User_page_option_box_right>
                {user_page_options_right}
              </User_page_option_box_right>
              <User_page_option_box_left>
                {user_page_options_left}
              </User_page_option_box_left>
            </User_page_option_box>
          </My_page_box>
        </Main_base>
      );
    } else {
      return (
        <Main_base navigation={navigation}>
          <My_page_box>
            <User_name_icon_box>
              <User_page_icon_box>
                <User_page_icon_image
                  source={{
                    uri:
                      site_url +
                      `media/user_icons/user_icon_${owner_user_id}.png`,
                  }}
                />
              </User_page_icon_box>
              <User_page_name_u>{username}</User_page_name_u>
              <User_follow_report_box>
                {follow_button}
                {owner_user_id == user_id ? (
                  <View />
                ) : (
                  <User_page_report_button
                    onPress={() => {
                      navigation.navigate("Report_page", {
                        subject_category: "user",
                        subject_id: owner_user_id,
                      });
                    }}
                  >
                    <User_page_report_button_text>
                      通報
                    </User_page_report_button_text>
                  </User_page_report_button>
                )}
                {/*順番は意味ある*/}
              </User_follow_report_box>
            </User_name_icon_box>
            {user_profile}
            <User_page_option_box>
              <User_page_option_box_left>
                {user_page_options_left}
              </User_page_option_box_left>
              <User_page_option_box_right>
                {user_page_options_right}
              </User_page_option_box_right>
            </User_page_option_box>
          </My_page_box>
        </Main_base>
      );
    }
  };
  return <User_page_entity />;
}
type delete_account_screen_props = {
  navigation: any;
  setout_of_main: Function;
};

const Delete_account_box = styled.View`
  position: relative;
  top: ${flexble_px(20)}
  left: 5%;
  width: 90%;
  display: block;
  min-height: ${flexble_px(400)}
  padding-top: 0px;
  border-radius: ${flexble_px(20)}
  background-color: #ffffff;
  text-align: center;
`;
const Delete_account_text = styled(General_text)`
  color: #555555;
  ${flexble_font_size(24)}
  top: 0px;
  text-align: left;
  margin-top: ${flexble_px(24)}
  margin-left: ${flexble_px(24)}
  margin-right: ${flexble_px(24)}
  margin-bottom: ${flexble_px(24)}
`;
const Password_input_box = styled.View`
  left: 10%;
  width: 80%;
`;

const Delete_account_button = styled(General_button)`
  min-width: ${flexble_px(300)}
  width:60%;
  height: ${flexble_px(60)}
  border-radius: ${flexble_px(30)}
  margin-top: ${flexble_px(40)}
  margin-bottom: ${flexble_px(40)}
  background-color: #ffffff;
  border-color: #41717c;
  border-width: 5px;
  margin-right: auto;
  margin-left: auto;
`;

const Delete_account_button_text = styled(General_text)`
  font-family: "NotoSans_700Bold";
  text-align: center;
  ${flexble_font_size(28)}
  height: 60px;
  margin-top: -5px;
  line-height: 60px;
  color: #41717c;
`;
function Delete_account_screen({
  navigation,
  setout_of_main,
}: delete_account_screen_props) {
  const [account_delete_count, setaccount_delete_count] = useState(0);

  function delete_account() {
    if (account_delete_count < 4) {
      showalert(
        "",
        `あと${4 - account_delete_count}回押すと、アカウントが削除されます。`
      );
      setaccount_delete_count(account_delete_count + 1);
    } else {
      setaccount_delete_count(0);
      let request_json_data = {
        password: password,
      };
      request_json_data = Object.assign(request_json_data, get_session_datas());
      fetch(site_url + "deleteaccount/process/app/", {
        method: "post",
        headers: {
          "Content-Type": "application/json", //JSON形式のデータのヘッダー
        },
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["result"] == "success") {
            showalert("", "アカウントを削除しました").then(() => {
              log_out(navigation);
            });
          } else if (data["result"] == "incorrect_password") {
            showalert("", "パスワードが間違っています。");
          } else if (data["result"] == "incorrect_session") {
            display_session_error(navigation);
          } else {
            showalert(
              "エラー",
              "エラーコード:東尋坊は絶景\n\nページを読み込み直した後も確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
            );
          }
        })
        .catch((error) => {
          showalert(
            "通信エラー",
            "エラーコード:マウスホイールの調子が悪い\n\n通信状況が問題ないことを確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
          );
        });
    }
  }
  const [password, setpassword] = useState("");
  return (
    <Gray_out_page
      onPress={() => {
        setout_of_main(<View />);
      }}
    >
      <Delete_account_box>
        <Delete_account_text>
          {"アカウントを削除するために、確認用のパスワードを入力してください(ゲストユーザーは入力不要)"}
        </Delete_account_text>
        <Password_input_box>
          <Password_input
            placeholder="確認用パスワード"
            value={password}
            max_length={255}
            onChangeText={(inputed_password: string) => {
              setpassword(inputed_password);
            }}
          />
        </Password_input_box>
        <Delete_account_button
          onPress={() => {
            delete_account();
          }}
        >
          <Delete_account_button_text>
            アカウント削除
          </Delete_account_button_text>
        </Delete_account_button>
      </Delete_account_box>
    </Gray_out_page>
  );
}

function Option_page({ navigation }: navi_props) {
  user_id = get_user_id();
  const Option_page_box = styled.View`
    background-color: #ffffff;
    text-align: center;
    margin-bottom: ${v_w(5.0)}px;
  `;
  const [options, setoptions] = useState(
    <View>
      <My_page_option
        onPress={() => {
          setout_of_main(
            <Riyoukiyaku_comp
              selectable={false}
              out_event={() => {
                setout_of_main(<View />);
              }}
            />
          );
        }}
      >
        <My_page_option_text>利用規約</My_page_option_text>
      </My_page_option>
      <My_page_option
        onPress={() => {
          setout_of_main(
            <Riyoukiyaku_comp
              is_priv={true}
              selectable={false}
              out_event={() => {
                setout_of_main(<View />);
              }}
            />
          );
        }}
      >
        <My_page_option_text>プライバシーポリシー</My_page_option_text>
      </My_page_option>
      <My_page_option
        onPress={() => {
          navigation.navigate("Contact_page");
        }}
      >
        <My_page_option_text>運営に連絡</My_page_option_text>
      </My_page_option>
      <My_page_option
        onPress={() => {
          Linking.openURL(site_url + "media/app_license.txt");
        }}
      >
        <My_page_option_text>ライセンス</My_page_option_text>
      </My_page_option>
      {user_id >= 1 ? (
        [
          <My_page_option
            key={213231}
            onPress={() => {
              open_delete_account_page();
            }}
          >
            <My_page_option_text>アカウント削除</My_page_option_text>
          </My_page_option>,
        ]
      ) : (
        <View />
      )}
      {false ? (
              <My_page_option
                key={3342234}
                onPress={() => {
                  re_first_boot();
                }}
              >
                <My_page_option_text>アプリを初期化</My_page_option_text>
              </My_page_option>
            ) : (
              <View  key={32342234}/>
            )}
    </View>
  );
  const [out_of_main, setout_of_main] = useState(<View />);
  const [delete_open_flag, setdelete_open_flag] = useState(false);
  function open_delete_account_page() {
    setout_of_main(
      <Delete_account_screen
        navigation={navigation}
        setout_of_main={setout_of_main}
      />
    );
  }
  return (
    <View>
      <Main_base navigation={navigation}>
        <My_page_box>
          <Option_page_box>{options}</Option_page_box>
        </My_page_box>
      </Main_base>
      {out_of_main}
    </View>
  );
}

export { My_page, User_page, Option_page };
