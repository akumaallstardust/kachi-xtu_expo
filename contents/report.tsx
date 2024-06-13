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
  Image_with_aspect_ratio,
  General_vertical_line,
  navi_props,
  Main_base,
  clearSpecificImageCache,
  open_select_option_box,
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
  top: ${v_w(3.0)}px;
  left: 0%;
  width: 100%;
  min-height: ${v_w(80.0)}px;
  padding-top: ${v_w(0.0)}px;
  border-radius: ${v_w(5.0)}px;
  background-color: #ffffff;
  text-align: left;
`;

const Report_category_select_box = styled.View`
  top: ${v_w(3.0)}px;
  position: relative;
  left: ${v_w(0)}px;
  width: 100%;
`;

const Report_category_select_vertical_line = styled(General_vertical_line)`
  height: ${v_w(8.0)}px;
  left: ${v_w(3.0)}px;
`;

const Report_category_select_text = styled.Text`
  position: relative;
  left: ${v_w(4.0)}px;
  font-size: ${v_w(4.0)}px;
  padding-left: ${v_w(2.0)}px;
  line-height: ${v_w(8.0)}px;
  color: #5a9fa6;
`;

const Open_report_category_select_button = styled.TouchableOpacity`
  position: absolute;
  border-width: 1px;
  border-color: #aaa;
  left: ${v_w(35)}px;
  width: ${v_w(60)}px;
  height: ${v_w(8)}px;
  background-color: #f6f6f6;
`;

const Open_report_category_select_button_text = styled.Text`
  font-size: ${v_w(3.5)}px;
  text-align: center;
  line-height: ${v_w(8)}px;
`;


const Report_comment_textarea = styled.TextInput`
  top: ${v_w(20.0)}px;
  position: absolute;
  left: ${v_w(6.0)}px;
  width: ${v_w(80.0)}px;
  min-height: ${v_w(20.0)}px;
  background-color: #f5f5f5;
  border-width: 1px;
  border-color: #41717c;
  padding-left: ${v_w(1.0)}px;
  height: ${v_w(6.0)}px;
  border-radius: ${v_w(0)}px;
  font-size: ${v_w(3.5)}px;
`;

const Report_button = styled(General_button)`
  position: absolute;
  bottom: ${v_w(10.0)}px;
  left: 30%;
  width: 35%;
  font-size: ${v_w(3.0)}px;
  height: ${v_w(10)}px;
  border-radius: ${v_w(1.0)}px;
  color: #41717c;
  background-color: #ffe599;
`;

const Report_button_text = styled.Text`
  color: #41717c;
  line-height: ${v_w(10)}px;
  text-align: center;
  font-size: ${v_w(5)}px;
`;

type report_page_props = {
  route: any;
  navigation: any;
};
function Report_page({ route, navigation }: report_page_props) {
  const subject_id = route.params.subject_id;
  const subject_category = route.params.subject_category;
  const [report_category, setreport_category] = useState(
    "malicious_misinformation"
  );
  const [report_category_label, setreport_category_label] =
    useState("悪意がある事実と異なる情報");
  const [report_comment, setreport_comment] = useState("");
  const [out_of_main, setout_of_main] = useState(<View />);
  function set_report_category_select_box() {
    /*<Order_item label="低評価(少ない順)" value="dislike_count_few" /> */
    open_select_option_box({
      setout_of_main: setout_of_main,
      option_list: [
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
      showalert("警告", "ユーザーの通報では備考が必須です");
    } else {
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
          } else {
            showalert(
              "エラー",
              "エラーコード:東北新幹線のチャイムは神\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
            );
          }
        })
        .catch((error) => {
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
              "エラーコード:鎌倉は混んでる\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
            );
          }
        })
        .catch((error) => {
          console.log(error);
          showalert(
            "通信エラー",
            "エラーコード:万引き対策のために警察署の隣に住む\n\n通信状態を確認してください\n\n通信状態を確認した後もこのメッセージが表示される場合はエラーコードと共に運営に伝えてください。"
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
export { Report_page,Contact_page };
