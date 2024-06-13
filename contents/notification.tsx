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
  is_android,
  censor_content,
  Image_with_aspect_ratio,
  jump_with_prams,
  navi_props,
  log_out,
  display_session_error,
} from "./parts";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImagePropsBase,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import styled from "styled-components/native";

type notification_comp_props = { notification_data: any; navigation: any };
function Notification_comp({
  notification_data,
  navigation,
}: notification_comp_props) {
  const Notification_box_unread = styled.TouchableOpacity`
    position: relative;
    background-color: white;
    min-height: ${v_w(10.0)}px;
    width: 100%;
    border-color: #aaa;
    border-bottom-width: 0px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
  `;
  const Notification_box_read = styled(Notification_box_unread)`
    background-color: #eeeeee;
    color: #9e9c97;
  `;
  const Notification_icon_box = styled.View`
    position: absolute;
    top: ${v_w(1.0)}px;
    left: ${v_w(1.0)}px;
    height: ${v_w(8.0)}px;
    width: ${v_w(8.0)}px;
    border-radius: ${v_w(1.0)}px;
    background-color: #f6f0e9;
  `;
  const Notification_icon = styled.Image`
    left: ${v_w(0.5)}px;
    top: ${v_w(0.5)}px;
    height: ${v_w(7.0)}px;
    width: ${v_w(7.0)}px;
  `;
  const Notification_text = styled.Text`
    color: #555555;
    margin-left: ${v_w(10.0)}px;
    font-size: ${v_w(3.5)}px;
    top: ${v_w(1)}px;
  `;
  function jump_from_notofication() {
    if (
      notification_data["notification_id"].slice(0, "new_comment".length) ==
      "new_comment"
    ) {
      jump_with_prams(
        "Uni_post_page",
        {
          content_id: Number(
            notification_data["notification_id"].slice("new_comment_".length)
          ),
          open_comment: true,
          move_to_latest_comment_flag: true,
          open_parent_comment_id: 0,
        },
        navigation
      );
    } else if (
      notification_data["notification_id"].slice(
        0,
        "new_child_comment".length
      ) == "new_child_comment"
    ) {
      jump_with_prams(
        "Uni_post_page",
        {
          content_id: Number(notification_data["parent_content_id"]),
          open_comment: true,
          move_to_latest_comment_flag: true,
          open_parent_comment_id: Number(
            notification_data["notification_id"].slice(
              "new_child_comment_".length
            )
          ),
        },
        navigation
      );
    }
  }
  if (notification_data["notification_read_flag"] == "n") {
    return (
      <View>
        <Notification_box_unread
          onPress={() => {
            jump_from_notofication();
          }}
        >
          <Notification_icon_box>
            <Notification_icon
              source={{ uri: site_url + `media/notification_icon.png` }}
            />
          </Notification_icon_box>
          <Notification_text>
            {notification_data["notification_content"]}
          </Notification_text>
        </Notification_box_unread>
      </View>
    );
  } else {
    return (
      <View>
        <Notification_box_read
          onPress={() => {
            jump_from_notofication();
          }}
        >
          <Notification_icon_box>
            <Notification_icon
              source={{
                uri: site_url + `media/notification_icon.png`,
              }}
            />
          </Notification_icon_box>
          <Notification_text>
            {notification_data["notification_content"]}
          </Notification_text>
        </Notification_box_read>
      </View>
    );
  }
}

function Notification_page({ navigation }: navi_props) {
  const No_notification_box=styled.View`
  top: ${v_w(0)}px;
  right: ${v_w(0)}px;
  width: 100%;
  height: ${v_w(10)}px;
  `
  const No_notification_text=styled.Text`
  text-align: center;
      font-size: ${v_w(5)}px;
      line-height: ${v_w(10)}px;
      color: #555555;
  `

  useFocusEffect(
    useCallback(() => {
      const user_id = get_user_id();
      if (user_id <= 0) {
      }
      let request_json_data;
      let session_datas = get_session_datas();
      request_json_data = {};
      request_json_data = Object.assign(session_datas, request_json_data);
      fetch(site_url + "get_notification_data_app/", {
        method: "post",
        headers: {
          "Content-Type": "application/json", //JSON形式のデータのヘッダー
        },
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["result"] == "success") {
            let notification_data_list = JSON.parse(data["notifications_json"]);
            notification_data_list.reverse();
            setnotifications(<View></View>);
            if (notification_data_list.length >= 1) {
              setnotifications(
                <View>
                  {notification_data_list.map((notification: any) => (
                    <Notification_comp
                      key={notification["notification_id"]}
                      notification_data={notification}
                      navigation={navigation}
                    />
                  ))}
                </View>
              );
            }
            else{
              setnotifications(<No_notification_box><No_notification_text>通知がありません</No_notification_text></No_notification_box>)
            }
          } else if (data["result"] == "incorrect_session") {
            display_session_error(navigation)
          } else {
            showalert(
              "エラー",
              "エラーコード:家の近くにココス(朝食バイキングあり)が欲しい\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
            );
          }
        })
        .catch((error: Error) => {
          console.log(error);
          showalert(
            "通信エラー",
            "エラーコード:いつも乗り換えで使うけど構内から出たことがない駅\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
          );
        });
      return () => {
        // 画面がアンフォーカスされたときに実行する処理（オプション）
        //setsearch_result(<View></View>)
      };
    }, [])
  );
  const [notifications, setnotifications] = useState(<View />);
  useEffect(() => {
    return () => {
      setnotifications(<View></View>);
    };
  }, []);
  return <Main_base navigation={navigation}>{notifications}</Main_base>;
}

export default Notification_page;
