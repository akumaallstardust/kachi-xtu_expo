import {
  site_url,
  Main_base_no_footer,
  General_button,
  General_input,
  showalert,
  get_uniqueid,
  get_user_id,
  get_session_datas,
  super_reload,
  v_h,
  censor_content,
  Image_with_aspect_ratio,
  General_vertical_line,
  navi_props,
  Main_base,
  clearSpecificImageCache,
  open_select_option_box,
  General_text,
  flexble_px,
  flexble_font_size,
  is_android,
} from "./parts";
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
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const Report_page_box = styled.View`
  position: relative;
  top: ${flexble_px(24)};
  left: 0%;
  width: 100%;
  min-height: ${flexble_px(600)};
  padding-top: 0px;
  border-radius: 20px;
  background-color: #ffffff;
  text-align: left;
`;

const Report_category_select_box = styled.View`
  top: ${flexble_px(24)};
  position: relative;
  left: 0px;
  width: 100%;
`;

const Report_category_select_vertical_line = styled(General_vertical_line)`
  height: ${flexble_px(60)};
  left: 7%;
`;

const Report_category_select_text = styled(General_text)`
  position: relative;
  left: 9%;
  ${flexble_font_size(28)}
  padding-left: ${flexble_px(16)};
  line-height: ${flexble_px(60)};
  color: #5a9fa6;
`;

const Open_report_category_select_button = styled(General_button)`
  border-width: 1px;
  border-color: #aaa;
  top: ${flexble_px(30)};
  margin-right: auto;
  margin-left: auto;
  width: 80%;
  max-width: 600px;
  height: ${flexble_px(60)};
  background-color: #f6f6f6;
`;

const Open_report_category_select_button_text = styled.Text`
  font-size: ${flexble_px(24)};
  text-align: center;
  line-height: ${flexble_px(60)};
`;

const Report_comment_textarea = styled(General_input)`
  top: ${flexble_px(120)};
  margin-right: auto;
  margin-left: auto;
  width: 70%;
  height: ${flexble_px(160)};
  background-color: #f5f5f5;
  border-width: 1px;
  border-color: #41717c;
  padding-left: ${flexble_px(8)};
  border-radius: 0px;
  ${flexble_font_size(24)}
`;

const Report_button = styled(General_button)`
  top: ${flexble_px(170)};
  left: 30%;
  width: 35%;
  font-size: ${flexble_px(24)};
  height: ${flexble_px(60)};
  border-radius: ${is_android ? flexble_px(60) : `50%`};
  color: #41717c;
  background-color: #ffe599;
`;

const Report_button_text = styled.Text`
  color: #41717c;
  line-height: ${flexble_px(60)};
  text-align: center;
  ${flexble_font_size(32)}
`;

type report_page_props = {
  route: any;
  navigation: any;
};
function Report_page({ route, navigation }: report_page_props) {
  const subject_id = route.params.subject_id;
  const subject_category = route.params.subject_category;
  const [report_category, setreport_category] = useState(
    "troll"
  );
  const [report_category_label, setreport_category_label] =
    useState("無意味なコンテンツなどの荒らし");
  const [report_comment, setreport_comment] = useState("");
  const [out_of_main, setout_of_main] = useState(<View />);
  const [p_flag,setp_flag]=useState(false)
  function set_report_category_select_box() {
    /*<Order_item label="低評価(少ない順)" value="dislike_count_few" /> */
    open_select_option_box({
      setout_of_main: setout_of_main,
      option_list: [
        {
          value: "troll",
          label: "無意味なコンテンツなどの荒らし",
        },
        {
          value: "malicious_misinformation",
          label: "悪意がある事実と異なる情報",
        },
        {
          value: "extremely_violent_content",
          label: "極度に暴力的なコンテンツ",
        },
        { value: "extremely_sexual_content", label: "極度に性的なコンテンツ" },
        {
          value: "behavior_soliciting_personal_information",
          label: "個人情報を求める行動",
        },
        {
          value: "behavior_soliciting_real-life_encounters",
          label: "現実での出会いを求める行動",
        },
        { value: "other_violations_of_terms", label: "その他規約違反" },
        { value: "other_legal_violations", label: "その他法律違反" },
        {
          value: "other_ethically_problematic_behaviors",
          label: "その他倫理的に問題がある行動",
        },
        {
          value:
            "behaviors_that_do_not_fit_the_above_items_but_are_problematic",
          label: "以上の項目に当てはまらないが問題がある行動",
        },
      ],
      selected_option: report_category,
      option_event: (option: { value: string; label: string }) => {
        setreport_category(option.value);
        setreport_category_label(option.label);
      },
    });
  }
  function submit_report() {
    if (
      report_comment.length == 0 &&
      (report_category == "other_violations_of_terms" ||
        report_category == "other_legal_violations" ||
        report_category == "other_ethically_problematic_behaviors" ||
        report_category ==
          "behaviors_that_do_not_fit_the_above_items_but_are_problematic")
    ) {
      alert("選択されている通報項目では備考が必須です");
    } else if (report_comment.length == 0 && subject_category == "user") {
      showalert("", "ユーザーの通報では備考が必須です");
    } 
    else if(p_flag){
      showalert("","処理中です")
    }
    else {
      setp_flag(true)
      let request_json_data = {
        report_category: report_category,
        report_comment: report_comment,
        subject_category: subject_category,
        subject_id: String(subject_id),
      };
      request_json_data = Object.assign(request_json_data, get_session_datas());
      fetch(site_url + "report_process/app/", {
        method: "post",
        headers: {},
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["result"] == "success") {
            navigation.goBack();
            setp_flag(false)
          } else {
            setp_flag(false)
            showalert(
              "エラー",
              "エラーコード:東北新幹線のチャイムは神\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
            );
          }
        })
        .catch((error) => {
          setp_flag(false)
          console.log(error);
          showalert(
            "通信エラー",
            "エラーコード:英文100語読むと日本語10000字読むのと同じくらい疲れる\n\n通信状態を確認してください\n\n通信状態を確認した後もこのメッセージが表示される場合はエラーコードと共に運営に伝えてください。"
          );
        });
    }
  }
  return (
    <View>
      <Main_base navigation={navigation}>
        <Report_page_box>
          <Report_category_select_box>
            <Report_category_select_vertical_line />
            <Report_category_select_text>
              通報項目を選択
            </Report_category_select_text>
            <Open_report_category_select_button
              onPress={() => {
                set_report_category_select_box();
              }}
            >
              <Open_report_category_select_button_text>
                {report_category_label}
              </Open_report_category_select_button_text>
            </Open_report_category_select_button>
          </Report_category_select_box>
          <Report_comment_textarea
            placeholder={"備考、連絡先などを入力する(通報項目によっては必須)"}
            placeholderTextColor={"#b7b7b7"}
            value={report_comment}
            multiline={true}
            style={{
              textAlignVertical: "top",
            }}
            onChangeText={(inputed_report_comment: string) => {
              let new_report_comment = censor_content(inputed_report_comment);
              if (new_report_comment.length >= 501) {
                new_report_comment = new_report_comment.slice(0, 500);
              }
              setreport_comment(new_report_comment);
            }}
          ></Report_comment_textarea>
          <Report_button
            onPress={() => {
              submit_report();
            }}
          >
            <Report_button_text>送信</Report_button_text>
          </Report_button>
        </Report_page_box>
      </Main_base>
      {out_of_main}
    </View>
  );
}

function Contact_page({ navigation }: navi_props) {
  const [report_comment, setreport_comment] = useState("");
  const [out_of_main, setout_of_main] = useState(<View />);
  function submit_report() {
    if (report_comment.length == 0) {
      showalert("警告", "内容を入力してください。");
    } else {
      let request_json_data = {
        report_category: "contact",
        report_comment: report_comment,
        subject_category: "contact",
        subject_id: "0",
      };
      request_json_data = Object.assign(request_json_data, get_session_datas());
      fetch(site_url + "report_process/app/", {
        method: "post",
        headers: {},
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["result"] == "success") {
            navigation.goBack();
          } else {
            showalert(
              "エラー",
              "エラーコード:気仙沼は大都会\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
            );
          }
        })
        .catch((error) => {
          console.log(error);
          showalert(
            "通信エラー",
            "エラーコード:echo dot 3は構造上異様に衝撃に強い\n\n通信状態を確認してください\n\n通信状態を確認した後もこのメッセージが表示される場合はエラーコードと共に運営に伝えてください。"
          );
        });
    }
  }
  return (
    <View>
      <Main_base navigation={navigation}>
        <Report_page_box>
          <Report_category_select_box>
            <Report_category_select_vertical_line />
            <Report_category_select_text>
              運営に連絡
            </Report_category_select_text>
          </Report_category_select_box>
          <Report_comment_textarea
            placeholder={"内容、連絡先などを入力する"}
            placeholderTextColor={"#b7b7b7"}
            value={report_comment}
            multiline={true}
            style={{
              textAlignVertical: "top",
            }}
            onChangeText={(inputed_report_comment: string) => {
              let new_report_comment = censor_content(inputed_report_comment);
              if (new_report_comment.length >= 501) {
                new_report_comment = new_report_comment.slice(0, 500);
              }
              setreport_comment(new_report_comment);
            }}
          ></Report_comment_textarea>
          <Report_button
            onPress={() => {
              submit_report();
            }}
          >
            <Report_button_text>送信</Report_button_text>
          </Report_button>
        </Report_page_box>
      </Main_base>
      {out_of_main}
    </View>
  );
}
export { Report_page, Contact_page };
