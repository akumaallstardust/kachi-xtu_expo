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
  navi_props,
  get_session_datas,
  log_out,
  General_text,
  Gray_out_page,
  alert_buttom,
  display_session_error,
  super_reload,
  Riyoukiyaku_comp,
} from "./parts";
import {
  Dimensions,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Password_input } from "./login_signup";
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components/native";

const My_page_box = styled.View`
  position: relative;
  top: ${v_w(3.0)}px;
  left: 0%;
  width: 100%;
  padding-top: ${v_w(0.0)}px;
  border-radius: ${v_w(5.0)}px;
  border-top-right-radius: ${v_w(0.0)}px;
  background-color: #ffffff;
  text-align: left;
  padding-bottom: ${v_w(0.0)}px;
  margin-bottom: ${v_w(5.0)}px;
`;

const User_name_icon_box = styled.View`
  position: relative;
  height: ${v_w(30.0)}px;
  width: 100%;
  margin-bottom: ${v_w(0.0)}px;
`;

const User_page_icon_box = styled.View`
  position: absolute;
  top: ${v_w(0.0)}px;
  left: ${v_w(0.0)}px;
  width: ${v_w(15.0)}px;
  height: ${v_w(15.0)}px;
`;

const User_page_icon_image = styled.Image`
  width: ${v_w(30.0)}px;
  height: ${v_w(30.0)}px;
`;

const User_page_name = styled(General_text)`
  color: #555555;
  position: absolute;
  font-size: ${v_w(5)}px;
  left: ${v_w(35.0)}px;
  top: ${v_w(2.0)}px;
  width: ${v_w(65.0)}px;
  color: black;
`;

const User_page_user_id = styled(General_text)`
  position: absolute;
  font-size: ${v_w(4.0)}px;
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
  min-height: ${v_w(10.0)}px;
`;

const User_page_profile_text = styled(General_text)`
  color: #555555;
  font-size: ${v_w(4.0)}px;
`;

const My_page_option = styled(TouchableOpacity)`
  height: ${v_w(12.0)}px;
  padding-left: ${v_w(5.0)}px;
  position: relative;
  margin-top: ${v_w(3)}px;
  background-color: #f3f3f3;
  border-bottom-color: #e0e0e0;
  border-bottom-width: 1px;
`;

const My_page_option_last = styled(My_page_option)`
  height: ${v_w(12.0)}px;
  padding-left: ${v_w(5.0)}px;
  position: relative;
`;

const My_page_option_text = styled(General_text)`
  color: #598994;
  font-size: ${v_w(5.0)}px;
  line-height: ${v_w(12.0)}px;
`;

function My_page({ navigation }: navi_props) {
  const user_id = get_user_id();
  const [username, setusername] = useState("読み込み中");
  const [user_profile, setuser_profile] = useState(<View />);
  const [options, setoptions] = useState(
    <View>
      <My_page_option
        onPress={() => {
          navigation.navigate("View_history_page");
        }}
      >
        <My_page_option_text>閲覧履歴</My_page_option_text>
      </My_page_option>
      <My_page_option
        onPress={() => {
          navigation.navigate("My_post_page");
        }}
      >
        <My_page_option_text>投稿作品</My_page_option_text>
      </My_page_option>
      <My_page_option
        onPress={() => {
          navigation.navigate("Change_user_info_page");
        }}
      >
        <My_page_option_text>ユーザー情報変更</My_page_option_text>
      </My_page_option>
      <My_page_option
        onPress={() => {
          navigation.navigate("Change_password_page");
        }}
      >
        <My_page_option_text>パスワード変更</My_page_option_text>
      </My_page_option>
      <My_page_option_last
        onPress={() => {
          log_out(navigation);
        }}
      >
        <My_page_option_text>ログアウト</My_page_option_text>
      </My_page_option_last>
    </View>
  );
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
              setoptions(
                <View>
                  <My_page_option
                    onPress={() => {
                      navigation.navigate("View_history_page");
                    }}
                  >
                    <My_page_option_text>閲覧履歴</My_page_option_text>
                  </My_page_option>
                  <My_page_option
                    onPress={() => {
                      navigation.navigate("My_post_page");
                    }}
                  >
                    <My_page_option_text>投稿作品</My_page_option_text>
                  </My_page_option>
                  <My_page_option
                    onPress={() => {
                      navigation.navigate("Change_user_info_page");
                    }}
                  >
                    <My_page_option_text>ユーザー情報変更</My_page_option_text>
                  </My_page_option>
                  <My_page_option
                    onPress={() => {
                      navigation.navigate("True_signup_page");
                    }}
                  >
                    <My_page_option_text>本登録</My_page_option_text>
                  </My_page_option>
                  <My_page_option_last
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
                  </My_page_option_last>
                </View>
              );
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
            "エラーコード:マウスパッドに巻き癖が付いて使いづらい\n\n通信状況が問題ないことを確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
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

const User_page_follow_button = styled.TouchableOpacity`
  position: absolute;
  bottom: ${v_w(0)}px;
  right: ${v_w(0)}px;
  width: ${v_w(30.0)}px;
  text-align: center;
  height: ${v_w(8.0)}px;
  border-width: 0;
  background-color: #41717c;
`;

const User_page_follow_button_text = styled(General_text)`
  color: #555555;
  text-align: center;
  color: white;
  line-height: ${v_w(8.0)}px;
  font-size: ${v_w(4.0)}px;
`;

const User_page_unfollow_button = styled(User_page_follow_button)`
  background-color: #003366;
`;

const User_page_unfollow_button_text = styled(User_page_follow_button_text)`
  color: #d3d3d3;
`;

const User_page_report_button = styled.TouchableOpacity`
  position: absolute;
  right: ${v_w(0)}px;
  top: ${v_w(0.0)}px;
  width: ${v_w(20.0)}px;
  text-align: center;
  height: ${v_w(6.0)}px;
  border-width: 1px;
  border-color: #41717c;
  background-color: white;
`;

const User_page_report_button_text = styled(General_text)`
  color: #555555;
  text-align: center;
  color: white;
  line-height: ${v_w(6.0)}px;
  font-size: ${v_w(4.0)}px;
  color: #41717c;
`;

const User_page_option_box = styled.View`
  width: 100%;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: #e0e0e0;
  margin-bottom: ${v_w(5.0)}px;
  min-height: ${v_w(50.0)}px;
`;

const User_page_option_box_left = styled.View`
  vertical-align: top;
  position: absolute;
  width: 25%;
  height: 100%;
  left: ${v_w(0.0)}px;
  border-right-width: 1px;
  border-color: #e0e0e0;
`;

const User_page_option_left = styled.TouchableOpacity`
  width: 100%;
  border-right-width: 1px;
  border-bottom-width: 2px;
  border-color: #e0e0e0;
  height: ${v_w(15.0)}px;
  text-align: center;
  background-color: white;
`;

const User_page_option_left_text = styled(General_text)`
  color: #555555;
  line-height: ${v_w(15.0)}px;
  font-size: ${v_w(4.0)}px;
  width: 100%;
  text-align: center;
  color: black;
`;

const User_page_option_left_selected = styled(User_page_option_left)`
  background-color: #41717c;
`;

const User_page_option_left_text_selected = styled(User_page_option_left_text)`
  color: white;
`;

const User_page_option_box_right = styled.View`
  vertical-align: top;
  position: relative;
  width: 75%;
  height: 100%;
  left: 25%;
  font-size: ${v_w(3.0)}px;
`;

const User_page_listed_title_button = styled.TouchableOpacity`
  width: 100%;
  min-height: ${v_w(8.0)}px;
  padding-right: ${v_w(8.0)}px;
  border-bottom-width: 1px;
  border-color: #e0e0e0;
`;

const User_page_listed_title_butto_text = styled(General_text)`
  color: #555555;
  font-weight: bold;
  text-align: left;
  position: relative;
  left: ${v_w(4.0)}px;
  font-size: ${v_w(3.5)}px;
  color: #41717c;
  width: 100%;
`;

const User_page_listed_user_box = styled.TouchableOpacity`
  width: 100%;
  min-height: ${v_w(12.0)}px;
  padding-right: ${v_w(8.0)}px;
  border-bottom-width: 1px;
  border-color: #e0e0e0;
`;

const User_page_listed_user_icon = styled.Image`
  position: absolute;
  width: ${v_w(12.0)}px;
  height: ${v_w(12.0)}px;
  left: 0px;
`;
const User_page_listed_username = styled(General_text)`
  color: #555555;
  text-align: left;
  position: relative;
  left: ${v_w(12.0)}px;
  font-size: ${v_w(3.5)}px;
  color: #41717c;
  width: 100%;
`;

let react_nateveは糞 = [{ id: 0, title: "" }];

function User_page({ route, navigation }: user_page_props) {
  const my_user_id = get_user_id();
  let user_id = route.params.user_id;
  const [username, setusername] = useState("読み込み中");
  const [user_profile, setuser_profile] = useState(<View />);
  const [follow_button, setfollow_button] = useState(
    user_id == my_user_id ? (
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
  const [user_post_dict_list, setuser_post_dict_list] = useState([
    { id: 0, title: "" },
  ]);

  const [user_followed_user_dict_list, setuser_followed_user_dict_list] =
    useState([
      {
        id: 0,
        name: "",
      },
    ]);
  const [user_page_options_left, setuser_page_options_left] = useState(
    <View>
      <User_page_option_left_selected
        onPress={() => {
          set_option("post");
        }}
      >
        <User_page_option_left_text_selected>
          投稿作品
        </User_page_option_left_text_selected>
      </User_page_option_left_selected>
      <User_page_option_left
        onPress={() => {
          set_option("user");
        }}
      >
        <User_page_option_left_text>フォロー</User_page_option_left_text>
      </User_page_option_left>
    </View>
  );
  function set_option(change: string) {
    if (change == "post") {
      setuser_page_options_left(
        <View>
          <User_page_option_left_selected
            onPress={() => {
              set_option("post");
            }}
          >
            <User_page_option_left_text_selected>
              投稿作品
            </User_page_option_left_text_selected>
          </User_page_option_left_selected>
          <User_page_option_left
            onPress={() => {
              set_option("user");
            }}
          >
            <User_page_option_left_text>フォロー</User_page_option_left_text>
          </User_page_option_left>
        </View>
      );
      let new_user_post_dict_list = react_nateveは糞;
      setuser_page_options_right(
        <View>
          {new_user_post_dict_list.length >= 1 ? (
            new_user_post_dict_list.map((post_data) => (
              <User_page_listed_title_button
                key={post_data.id}
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
            <View />
          )}
        </View>
      );
    } else if (change == "user") {
      setuser_page_options_left(
        <View>
          <User_page_option_left
            onPress={() => {
              set_option("post");
            }}
          >
            <User_page_option_left_text>投稿作品</User_page_option_left_text>
          </User_page_option_left>
          <User_page_option_left_selected
            onPress={() => {
              set_option("user");
            }}
          >
            <User_page_option_left_text_selected>
              フォロー
            </User_page_option_left_text_selected>
          </User_page_option_left_selected>
        </View>
      );
      setuser_page_options_right(
        <View>
          {user_followed_user_dict_list.length >= 1 ? (
            user_followed_user_dict_list.map((user_data) => (
              <User_page_listed_user_box
                key={user_data.id}
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
  const [user_page_options_right, setuser_page_options_right] = useState(
    <View />
  );
  async function setup() {
    setuser_page_options_left(
      <View>
        <User_page_option_left_selected
          onPress={() => {
            set_option("post");
          }}
        >
          <User_page_option_left_text_selected>
            投稿作品
          </User_page_option_left_text_selected>
        </User_page_option_left_selected>
        <User_page_option_left
          onPress={() => {
            set_option("user");
          }}
        >
          <User_page_option_left_text>フォロー</User_page_option_left_text>
        </User_page_option_left>
      </View>
    );
    let request_json_data = {
      user_id: String(user_id),
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
          if (followers_list.includes(String(my_user_id))) {
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
          react_nateveは糞 = new_user_post_dict_list;
          setuser_post_dict_list(new_user_post_dict_list);
          setuser_page_options_right(
            <View>
              {new_user_post_dict_list.length >= 1 ? (
                new_user_post_dict_list.map((post_data) => (
                  <User_page_listed_title_button
                    key={post_data.id}
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
                <View />
              )}
            </View>
          );
          let followed_user_user_id_str_list =data["followed_users"]=="" ? []:data["followed_users"].split(",");
          let followed_user_username_list =
            data["followed_username_combined"] != ""
              ? data["followed_username_combined"].split("<")
              : [];
          let new_user_followed_user_dict_list:{id: 0,name: "",}[]=[]
          for (let i = 0; i < followed_user_user_id_str_list.length; i++) {
            user_followed_user_dict_list[i] = {
              id: Number(followed_user_user_id_str_list[i]),
              name: followed_user_username_list[i],
            };
          }
          setuser_followed_user_dict_list(new_user_followed_user_dict_list);
        } else {
          showalert(
            "エラー",
            "エラーコード:牛乳を一気飲み\n\n読み込み直しても同じエラーが出るときは運営にエラーコードと共に伝えてください。"
          );
        }
      })
      .catch((error) => {
        console.log(error);
        showalert(
          "通信エラー",
          "エラーコード:東京新大阪間の新幹線代が高すぎる\n\n通信状況が問題ないことを確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
        );
      });
  }
  useEffect(() => {
    setup();
  }, [user_id]); //空の依存配列を渡すことで、コンポーネントのマウント時にのみ実行されます

  function follow() {
    let request_json_data = {
      followed_user_id: String(user_id),
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
          alert("エラー78932794798279\nページを再読み込みします");
        }
      })
      .catch((error) => {
        showalert(
          "通信エラー",
          "エラーコード:ココスのバイキングはコスパ最高\n\n通信状態を確認してください\n\n通信状態を確認した後もこのメッセージが表示される場合はエラーコードと共に運営に伝えてください。"
        );
        console.log(error);
      });
  }

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
          {user_id == my_user_id ? (
            <View />
          ) : (
            <User_page_report_button
              onPress={() => {
                navigation.navigate("Report_page", {
                  subject_category: "user",
                  subject_id: user_id,
                });
              }}
            >
              <User_page_report_button_text>通報</User_page_report_button_text>
            </User_page_report_button>
          )}
          <User_page_name>{username}</User_page_name>
          {follow_button}
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
type delete_account_screen_props={
  navigation:any;
  setout_of_main:Function
}

const Delete_account_box = styled.View`
    position: relative;
    top: ${v_w(3.0)}px;
    left: 5%;
    width: 90%;
    display: block;
    min-height: ${v_w(50)}px;
    padding-top: ${v_w(0)}px;
    border-radius: ${v_w(5.0)}px;
    background-color: #ffffff;
    text-align: center;
    margin-bottom: ${v_w(5.0)}px;
  `;
  const Delete_account_text = styled(General_text)`
    color: #555555;
    font-size: ${v_w(4.0)}px;
    top: 0px;
    text-align: left;
    margin-top: ${v_w(3)}px;
    margin-left: ${v_w(3)}px;
    margin-right: ${v_w(3)}px;
    margin-bottom: ${v_w(3)}px;
  `;
  const Password_input_box = styled.View`
    left: 10%;
    width: 80%;
  `;

  const Delete_account_button = styled(General_button)`
    width: ${v_w(60.0)}px;
    height: ${v_w(8.0)}px;
    border-radius: ${v_w(1.0)}px;
    margin-top: ${v_w(5)}px;
    margin-bottom: ${v_w(5)}px;
    border-radius: ${v_w(2.0)}px;
    background-color: #ffffff;
    border-color: #41717c;
    border-width: ${v_w(0.6)}px;
    margin-right: auto;
    margin-left: auto;
  `;

  const Delete_account_button_text = styled(General_text)`
    font-family: "NotoSans_700Bold";
    text-align: center;
    font-size: ${v_w(4)}px;
    height: ${v_w(8.0)}px;
    margin-top: ${v_w(-0.7)}px;
    line-height: ${v_w(8.0)}px;
    color: #41717c;
  `;
function Delete_account_screen({navigation,setout_of_main}:delete_account_screen_props){
  const [account_delete_count, setaccount_delete_count] = useState(0);

  function delete_account() {
    if (password == "") {
      showalert("", `パスワードを入力してください`);
    } else if (account_delete_count < 4) {
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
      request_json_data = Object.assign(
        request_json_data,
        get_session_datas()
      );
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
              log_out(navigation)
              super_reload();
            });
          } else if (data["result"] == "incorrect_password") {
            showalert("", "パスワードが間違っています。");
          } else if (data["result"] == "incorrect_session") {
            display_session_error(navigation);
          } else {
            showalert(
              "エラー",
              "エラーコード:万引き対策のために警察署の隣に住んでる\n\nページを読み込み直した後も確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
            );
          }
        })
        .catch((error) => {
          showalert(
            "通信エラー",
            "エラーコード:ママチャリでレインボーロード走る\n\n通信状況が問題ないことを確認した後も同じエラーが出るときは運営にエラーコードと共に伝えてください。"
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
          {"アカウントを削除するために、確認用のパスワードを入力してください"}
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
};

function Option_page({ navigation }: navi_props) {
  const user_id = get_user_id();
  const Option_page_box=styled.View`
  background-color: #ffffff;
    text-align: center;
    margin-bottom: ${v_w(5.0)}px;
  `
  const [options, setoptions] = useState(
    <View>
      <My_page_option
        onPress={() => {
          setout_of_main(<Riyoukiyaku_comp selectable={false} out_event={()=>{setout_of_main(<View/>)}} />)
        }}
      >
        <My_page_option_text>利用規約</My_page_option_text>
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
          navigation.navigate("License_page");
        }}
      >
        <My_page_option_text>ライセンス</My_page_option_text>
      </My_page_option>
      {user_id >= 1 ? (
        <My_page_option_last
          onPress={() => {
            open_delete_account_page();
          }}
        >
          <My_page_option_text>アカウント削除</My_page_option_text>
        </My_page_option_last>
      ) : (
        <View />
      )}
    </View>
  );
  const [out_of_main, setout_of_main] = useState(<View />);
  const [delete_open_flag, setdelete_open_flag] = useState(false);
  function open_delete_account_page() {
    setout_of_main(<Delete_account_screen navigation={navigation} setout_of_main={setout_of_main} />);
  }
  return (
    <View>
      <Main_base navigation={navigation}>
        <My_page_box><Option_page_box>{options}</Option_page_box></My_page_box>
      </Main_base>
      {out_of_main}
    </View>
  );
}

export { My_page, User_page, Option_page };
