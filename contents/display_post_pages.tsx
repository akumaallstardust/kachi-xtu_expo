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
  navi_props,
  navi_param_props,
  jump_with_prams,
  open_select_option_box,
  Close_discussion_box_button_base,
  Gray_out_page,
  General_text,
  General_vertical_line,
  v_h,
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
  ImagePropsBase,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFocusEffect,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Svg, { SvgProps, Path, Circle, err } from "react-native-svg";
import styled from "styled-components/native";

const Search_page_box = styled.View`
  width: 100%;
  position: relative;
`;

const Search_box = styled.View`
  border-top-width: ${v_w(0.8)}px;
  border-top-color: #41717c;
  text-align: center;
  width: 96%;
  left: 2%;
  height: ${v_w(50.0)}px;
  border-bottom-left-radius: ${v_w(10.0)}px;
  border-bottom-right-radius: ${v_w(10.0)}px;
  padding-top: ${v_w(1.0)}px;
  padding-bottom: ${v_w(1.0)}px;
  padding-left: ${v_w(2.0)}px;
  padding-right: ${v_w(2.0)}px;
  background-color: white;
  margin-bottom: ${v_w(3.0)}px;
  margin-top: ${v_w(2.0)}px;
`;

const Search_input_text_box = styled.View`
  top: ${v_w(1)}px;
  width: ${v_w(92)}px;
  width:100%;
  border-width: ${v_w(0)}px;
  background-color: #41717c;
  border-color: #41717c;
  border-radius: ${v_w(1.0)}px;
  height: ${v_w(8)}px;
  margin-bottom: ${v_w(3.0)}px;
`;

const Search_input_text = styled(General_text)`
  left: ${v_w(2)}px;
  font-size: ${v_w(5)}px;
  color: #ffffff;
  line-height: ${v_w(8)}px;
`;

const Search_input = styled(General_input)`
  position: absolute;
  margin-bottom: ${v_w(3.0)}px;
  left: ${v_w(15)}px;
  width: ${75*0.96}%;
  font-size: ${v_w(4)}px;
  height: ${v_w(8.0)}px;
  border-width: ${v_w(0.4)}px;
  border-color: #41717c;
  background-color: white;
  border-radius: ${v_w(1.0)}px;
  padding-left: ${v_w(0.4)}px;
`;

const Search_order_select_box = styled.View`
  left: ${v_w(0)}px;
  width:100%;
  border-width: ${v_w(0)}px;
  background-color: #41717c;
  border-color: #41717c;
  border-radius: ${v_w(1.0)}px;
  height: ${v_w(8)}px;
`;

const Search_order_select_box_text = styled(General_text)`
  position: absolute;
  left: ${v_w(0)}px;
  top: ${v_w(0)}px;
  font-size: ${v_w(5)}px;
  color: #ffffff;
  padding-left: ${v_w(2)}px;
  height: ${v_w(8)}px;
  line-height: ${v_w(8)}px;
  border-left-width: ${v_w(1)}px;
  border-color: #ffe599;
`;

const Open_search_order_select_button = styled.TouchableOpacity`
  position: absolute;
  left: ${v_w(22)}px;
  border-width: ${v_w(0.4)}px;
  border-color: #41717c;
  width: ${v_w(50)}px;
  height: 100%;
  background-color: #ffffff;
`;

const Open_search_order_select_button_text = styled(General_text)`
  color: #555555;
  font-size: ${v_w(3.5)}px;
  text-align: center;
  line-height: ${v_w(7.2)}px;
`;

const Search_button = styled(General_button)`
  width: ${v_w(30.0)}px;
  height: ${v_w(8.0)}px;
  border-radius: ${v_w(1.0)}px;
  margin-top: ${v_w(5)}px;
  border-radius: ${v_w(2.0)}px;
  background-color: #ffffff;
  border-color: #5a9fa6;
  border-width: ${v_w(0.6)}px;
  margin-right: auto;
  margin-left: auto;
`;

const Search_button_text = styled(General_text)`
  text-align: center;
  font-size: ${v_w(5)}px;
  line-height: ${v_w(8.0)}px;
  margin-top: ${v_w(-0.6)}px;
  text-align: center;
  color: #41717c;
`;

const Search_result_none_text = styled(General_text)`
  font-size: ${v_w(3.5)}px;
  color: #555555;
  margin-right: auto;
  margin-left: auto;
`;

const Discussion_box = styled.ScrollView`
  width: ${v_w(94)}px;
  top: ${v_h(6)}px;
  left: ${v_w(3)}px;
  max-height: 95%;
  border-radius: ${v_w(5.0)}px;
  background-color: white;
`;

const Close_discussion_box_button = styled(General_button)`
  top: ${v_w(3)}px;
  left: 93%;
  height: ${v_w(12.0)}px;
  width: ${v_w(12.0)}px;
  position: absolute;
`;

const Add_comment_textarea_box = styled.View`
  top: ${v_w(3.0)}px;
  width: 80%;
  left: 10%;
  position: relative;
  background-color: #f5f5f5;
`;

const Add_comment_textarea = styled(General_input)`
  text-align: left;
  position: absolute;
  top: ${v_w(0.0)}px;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-width: 1px;
  border-color: #b6c3c6;
  border-radius: ${v_w(0.0)}px;
  font-size: ${v_w(3.5)}px;
`;

const Add_comment_textarea_dummy = styled(General_text)`
  min-height: ${v_w(30.0)}px;
  pointer-events: none;
  width: 100%;
  text-align: left;
  opacity: 0;
  padding-left: 0vw;
  padding-right: 0vw;
  font-size: ${v_w(3.5)}px;
  border-width: 1px;
  border-color: transparent;
`;

const Add_comment_button = styled(General_button)`
  width: ${v_w(30.0)}px;
  height: ${v_w(8.0)}px;
  border-radius: ${v_w(1.0)}px;
  margin-top: ${v_w(5)}px;
  margin-bottom: ${v_w(5)}px;
  border-radius: ${v_w(2.0)}px;
  background-color: #ffe599;
  border-color: #ffdf80;
  border-width: ${v_w(0.6)}px;
  margin-right: auto;
  margin-left: auto;
`;

const Add_comment_button_text = styled(General_text)`
  text-align: center;
  font-size: ${v_w(5)}px;
  height: ${v_w(8.0)}px;
  margin-top: ${v_w(-0.7)}px;
  line-height: ${v_w(8.0)}px;
  color: #41717c;
`;

const Comment_box = styled.View`
  width: 100%;
  min-height: ${v_w(12)}px;
  position: relative;
  border-top-width: 1px;
  border-top-color: #b6c3c6;
  padding-top: ${v_w(0)}px;
  margin-bottom: ${v_w(5)}px;
  padding-bottom: ${v_w(0)}px;
`;

const Comment_user_box = styled.View`
  position: relative;
  min-height: ${v_w(12)}px;
  margin-top: ${v_w(0)}px;
  top: ${v_w(0.2)}px;
  left: ${v_w(0.0)}px;
  text-align: left;
  padding-left: ${v_w(1.5)}px;
  padding-bottom: ${v_w(0.6)}px;
  border-bottom-width: ${v_w(0.5)}px;
  border-bottom-color: rgba(255, 237, 183, 0.7);
`;

const Comment_user_icon = styled.TouchableOpacity`
  position: absolute;
  width: ${v_w(12.0)}px;
  height: ${v_w(12.0)}px;
`;

const Comment_user_icon_image = styled.Image`
  width: ${v_w(12)}px;
  height: ${v_w(12)}px;
`;

const Comment_username = styled.TouchableOpacity`
  position: absolute;
  top: 0px;
  left: ${v_w(13)}px;
`;

const Comment_username_text = styled(General_text)`
  color: #41717c;
  font-size: ${v_w(3.5)}px;
`;

const Comment_report_button = styled.TouchableOpacity`
  position: absolute;
  margin-top: ${v_w(0.0)}px;
  right: ${v_w(0.0)}px;
  width: ${v_w(10.0)}px;
  height: ${v_w(8.0)}px;
  border-right-width: 1px;
  border-right-color: #e0e0e0;
  border-left-width: 1px;
  border-left-color: #e0e0e0;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

const Comment_report_button_text = styled(General_text)`
  font-size: ${v_w(3.5)}px;
  line-height: ${v_w(8.0)}px;
  text-align: center;
  color: #41717c;
`;

const Comment_delete_button = styled(Comment_report_button)``;

const Comment_delete_button_text = styled(Comment_report_button_text)``;

const Comment_content = styled(General_text)`
margin-top:${v_w(2)}px;
  color: #555555;
  font-size: ${v_w(3.5)}px;
  text-align: left;
  padding-left: ${v_w(0.5)}px;
`;

const Open_child_comment_button = styled(General_button)`
  height: ${v_w(6.0)}px;
  width: ${v_w(24.0)}px;
  margin-left: auto;
  margin-right: auto;
  border-top-color: #ffe599;
  border-left-color: #ffe599;
  border-bottom-color: #ffe599;
  border-right-color: #ffe599;
  background-color: #f5f5f5;
  border-width: ${v_w(0.6)}px;
`;

const Open_child_comment_button_text = styled(General_text)`
  font-size: ${v_w(3.5)}px;
  line-height: ${v_w(4.9)}px;
  text-align: center;
  color: #41717c;
`;

const Child_comments_box = styled.View`
  width: 90%;
  margin-left: 10%;
`;

const Add_child_comment_textarea_box = styled.View`
  top: ${v_w(3.0)}px;
  width: 95%;
  left: 0%;
  position: relative;
  background-color: #f5f5f5;
  border-width: 0px;
  border-color: #b6c3c6;
`;

const Add_child_comment_textarea = styled(General_input)`
  text-align: left;
  position: absolute;
  top: ${v_w(0.0)}px;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-width: 1px;
  border-color: #b6c3c6;
  border-radius: ${v_w(0.0)}px;
  font-size: ${v_w(3.5)}px;
`;

const Add_child_comment_textarea_dummy = styled(General_text)`
  color: #555555;
  min-height: ${v_w(20.0)}px;
  pointer-events: none;
  width: 100%;
  text-align: left;
  opacity: 0;
  padding-left: 0vw;
  padding-right: 0vw;
  font-size: ${v_w(3.5)}px;
  border-width: 1px;
  border-color: #b6c3c6;
`;

const Add_child_comment_button = styled(General_button)`
  width: ${v_w(30.0)}px;
  height: ${v_w(8.0)}px;
  border-radius: ${v_w(1.0)}px;
  margin-top: ${v_w(5)}px;
  margin-bottom: ${v_w(5)}px;
  border-radius: ${v_w(2.0)}px;
  background-color: #ffe599;
  border-color: #ffdf80;
  border-width: ${v_w(0.6)}px;
  margin-right: auto;
  margin-left: auto;
`;

const Add_child_comment_button_text = styled(General_text)`
  text-align: center;
  font-size: ${v_w(5)}px;
  height: ${v_w(8.0)}px;
  margin-top: ${v_w(-0.7)}px;
  line-height: ${v_w(8.0)}px;
  color: #41717c;
`;

const user_id = get_user_id();

async function post_comment(
  parent_content_id: Number,
  parent_comment_id = 0,
  new_comment_content = ""
) {
  return new Promise((resolve, reject) => {
    if (new_comment_content != "") {
      let session_datas = get_session_datas();
      let request_json_data = {
        content_id: String(parent_content_id),
        comment_content: new_comment_content,
        parent_comment_id: String(parent_comment_id),
      };
      request_json_data = Object.assign(session_datas, request_json_data);
      fetch(site_url + "add_comment/app/", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          resolve({
            result: data["result"],
            comment_id: Number(data["comment_id"]),
            comment_content: data["comment_content"],
            comment_username: data["comment_username"],
          });
        })
        .catch((error: any) => {
          console.log(error);
          reject({ result: "error" });
        });
    } else {
      reject({ result: "none_content" });
    }
  });
}

type child_comment_props = {
  comment_data: {
    comment_id: number;
    comment_user_id: number;
    comment_username: string;
    comment_content: string;
  };
  navigation: any;
};
function Child_comment({ comment_data, navigation }: child_comment_props) {
  const comment_ref:any = useRef(null);
  useEffect(() => {
    if (move_comment_id == comment_data.comment_id) {
      const timeoutId = setTimeout(() => {
        move_to_comment(comment_ref);
      }, 100);
    }
  }, []);
  let delete_count = 0;
  let delete_processing_flag=false
  function delete_comment() {
    if (delete_count <= 1) {
      showalert("", `後${2 - delete_count}回押したら削除されます`);
      delete_count++;
    } 
    else if(delete_processing_flag==false) {
      delete_processing_flag=true
      let session_datas = get_session_datas();
      let request_json_data = { comment_id: String(comment_data.comment_id) };
      request_json_data = Object.assign(session_datas, request_json_data);
      fetch(site_url + "delete_comment/app/", {
        method: "post",
        headers: {
          "Content-Type": "application/json", //JSON形式のデータのヘッダー
        },
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          delete_processing_flag=false
          if (data["result"] == "success") {
            showalert("", "削除に成功しました");
            if (comment_ref.current) {
              comment_ref.current.setNativeProps({
                style: { display: "none" },
              });
            }
          }
          else{
            showalert(
              "エラー",
              `エラーコード:うちの庭にウラン鉱山できないかなぁ。\n\n読み込み直しても同じエラーが出るときは運営にエラーコードと共に伝えてください。`
            );
          }
        })
        .catch((error:Error)=>{
          delete_processing_flag=false
          console.log(error)
          showalert(
            "通信エラー",
            "エラーコード:刑務所に観覧席つけてサファリパークみたいにしてほしい。\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
          );
        })
    }
  }
  return (
    <Comment_box ref={comment_ref}>
      <Comment_user_box>
        <Comment_user_icon>
          <Comment_user_icon_image
            source={{
              uri:
                site_url +
                `media/user_icons/user_icon_mini_${comment_data.comment_user_id}.png`,
            }}
          />
        </Comment_user_icon>
        <Comment_username>
          <Comment_username_text>
            {comment_data.comment_username}
          </Comment_username_text>
        </Comment_username>
        {comment_data.comment_user_id == user_id ? (
            <Comment_delete_button
              onPress={() => {
                delete_comment();
              }}
            >
              <Comment_delete_button_text>削除</Comment_delete_button_text>
            </Comment_delete_button>
          ) : (
            <Comment_report_button
              onPress={() => {
                jump_with_prams(
                  "Report_page",
                  {
                    subject_category: "comment",
                    subject_id: comment_data.comment_id,
                  },
                  navigation
                );
              }}
            >
              <Comment_report_button_text>通報</Comment_report_button_text>
            </Comment_report_button>
          )}
      </Comment_user_box>
      <Comment_content>{comment_data.comment_content}</Comment_content>
    </Comment_box>
  );
}

type child_comment_box_comp_props = {
  parent_content_id: Number;
  parent_comment_id: number;
  child_commnt_data_list: any;
  setout_of_main: Function;
  navigation: any;
};
function Child_comment_box_comp({
  parent_content_id,
  parent_comment_id,
  child_commnt_data_list,
  setout_of_main,
  navigation,
}: child_comment_box_comp_props) {
  const [
    add_child_comment_textarea_content,
    setadd_child_comment_textarea_content,
  ] = useState("");
  const [
    post_child_comment_processing_flag,
    setpost_child_comment_processing_flag,
  ] = useState(false);

  const [child_commnts_data, setchild_commnts_data] = useState(
    child_commnt_data_list
  );

  const [child_comments, setchild_comments] = useState(
    <View>
      {child_commnts_data.map((comment_data: any) => (
        <Child_comment
          key={comment_data.comment_id}
          comment_data={comment_data}
          navigation={navigation}
        />
      ))}
    </View>
  );
  return (
    <Child_comments_box>
      <Add_child_comment_textarea_box>
        <Add_child_comment_textarea_dummy>
          {add_child_comment_textarea_content + "\u200b"}
        </Add_child_comment_textarea_dummy>
        <Add_child_comment_textarea
          style={{
            textAlignVertical: "top",
          }}
          value={add_child_comment_textarea_content}
          multiline={true}
          placeholder={"返信を書く"}
          onChangeText={(inputed_comment: string) => {
            let new_comment = censor_content(inputed_comment);
            if (inputed_comment.length >= 500) {
              new_comment = new_comment.slice(0, 500);
            }
            setadd_child_comment_textarea_content(new_comment);
          }}
        />
      </Add_child_comment_textarea_box>
      <Add_child_comment_button
        onPress={() => {
          if (post_child_comment_processing_flag == false) {
            setpost_child_comment_processing_flag(true);
            post_comment(
              parent_content_id,
              parent_comment_id,
              add_child_comment_textarea_content
            ).then((data: any) => {
              setpost_child_comment_processing_flag(false);
              if (data["result"] == "success") {
                let new_child_comments_data = child_commnts_data;
                move_comment_id = Number(data["comment_id"]);
                new_child_comments_data[new_child_comments_data.length] = {
                  comment_id: Number(data["comment_id"]),
                  comment_content: data["comment_content"],
                  comment_user_id: user_id,
                  comment_username: data["comment_username"],
                  comment_date: "仮の値",
                };
                setadd_child_comment_textarea_content("");
                setchild_commnts_data(new_child_comments_data);
                setchild_comments(<View></View>);
                setchild_comments(
                  <View>
                    {child_commnts_data.map((comment_data: any) => (
                      <Child_comment
                        key={comment_data.comment_id}
                        comment_data={comment_data}
                        navigation={navigation}
                      />
                    ))}
                  </View>
                );
              } else {
                showalert(
                  "投稿に失敗しました",
                  `以下の可能性があります\nネットワーク接続がうまくいっていない\nセッション認証の不具合\n無効なコンテンツ`
                );
              }
            });
          }
        }}
      >
        <Add_child_comment_button_text>投稿</Add_child_comment_button_text>
      </Add_child_comment_button>
      {child_comments}
    </Child_comments_box>
  );
}

type parent_comment_props = {
  parent_content_id: Number;
  comment_data: {
    comment_id: number;
    comment_content: string;
    comment_user_id: number;
    comment_username: string;
    comment_date: string;
    deleted_flag: boolean;
    child_comment_map: {
      comment_id: number;
      comment_content: string;
      comment_user_id: number;
      comment_username: string;
      comment_date: string;
    }[];
  };
  setout_of_main: Function;
  navigation: any;
};
function Parent_comment({
  parent_content_id,
  comment_data,
  setout_of_main,
  navigation,
}: parent_comment_props) {
  const [child_comment_open_flag, setchild_comment_open_flag] = useState(false);
  const [child_comment_open_button_text, setchild_comment_open_button_text] =
    useState("返信を読む");
  const [child_comment_comp, setchild_comment_comp] = useState(<View />);
  const comment_top_ref:any=useRef(null)
  const comment_ref: any = useRef(null);
  function open_child_comment() {
    if (child_comment_open_flag == false) {
      setchild_comment_open_button_text("返信を閉じる");
      setchild_comment_comp(
        <Child_comment_box_comp
          key={comment_data.comment_id}
          parent_content_id={parent_content_id}
          parent_comment_id={comment_data.comment_id}
          navigation={navigation}
          setout_of_main={setout_of_main}
          child_commnt_data_list={comment_data.child_comment_map}
        />
      );
      setchild_comment_open_flag(true);
    } else {
      setchild_comment_open_button_text("返信を読む");
      setchild_comment_comp(<View></View>);
      setchild_comment_open_flag(false);
    }
  }
  useEffect(() => {
    if (comment_data.comment_id == move_comment_id) {
      const timeoutId = setTimeout(() => {
        move_to_comment(comment_ref);
      }, 100);
    } else {
      for (let i = 0; i < comment_data.child_comment_map.length; i++) {
        if (comment_data.child_comment_map[i].comment_id == move_comment_id) {
          open_child_comment();
        }
      }
    }
  }, []);
  let delete_count = 0;
  let delete_processing_flag=false
  function delete_comment() {
    if (delete_count <= 1) {
      showalert("", `後${2 - delete_count}回押したら削除されます`);
      delete_count++;
    } 
    else if(delete_processing_flag==false) {
      delete_processing_flag=true
      let session_datas = get_session_datas();
      let request_json_data = { comment_id: String(comment_data.comment_id) };
      request_json_data = Object.assign(session_datas, request_json_data);
      fetch(site_url + "delete_comment/app/", {
        method: "post",
        headers: {
          "Content-Type": "application/json", //JSON形式のデータのヘッダー
        },
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          delete_processing_flag=false
          if (data["result"] == "success") {
            showalert("", "削除に成功しました");
            if (comment_top_ref.current) {
              comment_top_ref.current.setNativeProps({
                style: { display: "none" },
              });
            }
          }
          else{
            showalert(
              "エラー",
              `エラーコード:うちの庭にウラン鉱山できないかなぁ。\n\n読み込み直しても同じエラーが出るときは運営にエラーコードと共に伝えてください。`
            );
          }
        })
        .catch((error:Error)=>{
          delete_processing_flag=false
          console.log(error)
          showalert(
            "通信エラー",
            "エラーコード:刑務所に観覧席つけてサファリパークみたいにしてほしい。\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
          );
        })
    }
  }
  if(comment_data.deleted_flag){
return(<View/>)
  }
  else{
    return (
      <Comment_box ref={comment_top_ref}>
        <Comment_user_box>
          <Comment_user_icon>
            <Comment_user_icon_image
              source={{
                uri:
                  site_url +
                  `media/user_icons/user_icon_mini_${comment_data.comment_user_id}.png`,
              }}
            />
          </Comment_user_icon>
          <Comment_username
            onPress={() => {
              navigation.navigate("User_page", {
                user_id: comment_data.comment_user_id,
              });
            }}
          >
            <Comment_username_text>
              {comment_data.comment_username}
            </Comment_username_text>
          </Comment_username>
          {comment_data.comment_user_id == user_id ? (
            <Comment_delete_button
              onPress={() => {
                delete_comment();
              }}
            >
              <Comment_delete_button_text>削除</Comment_delete_button_text>
            </Comment_delete_button>
          ) : (
            <Comment_report_button
              onPress={() => {
                jump_with_prams(
                  "Report_page",
                  {
                    subject_category: "comment",
                    subject_id: comment_data.comment_id,
                  },
                  navigation
                );
              }}
            >
              <Comment_report_button_text>通報</Comment_report_button_text>
            </Comment_report_button>
          )}
        </Comment_user_box>
        <Comment_content ref={comment_ref}>
          {comment_data.comment_content}
        </Comment_content>
        <Open_child_comment_button
              onPress={() => {
                open_child_comment();
              }}
            >
              <Open_child_comment_button_text>
                {child_comment_open_button_text}
              </Open_child_comment_button_text>
            </Open_child_comment_button>
            {child_comment_comp}
      </Comment_box>
    );
  }
}

interface comment_id_ref_dict_interface {
  [comment_id: number]: { parent_comment_id: number; ref: any };
}
let comment_id_ref_dict: comment_id_ref_dict_interface = {};
let move_comment_id = 0;
let discussion_box_ref: any;

function move_to_comment(comment_ref: any) {
  if (discussion_box_ref.current && comment_ref.current) {
    // comment_refの位置を取得
    comment_ref.current.measureLayout(
      discussion_box_ref.current,
      (x: any, y: any, width: any, height: any) => {
        discussion_box_ref.current.scrollTo({
          x: 0,
          y: y,
          animated: true,
        });
      },
      (error: Error) => {
        console.error("コメントへのスクロールに失敗しました: ", error);
      }
    );
  }
}

type discussion_box_comp_props = {
  parent_content_id: Number;
  comment_data_list: {
    comment_id: number;
    comment_content: string;
    comment_user_id: number;
    comment_username: string;
    comment_date: string;
    deleted_flag: boolean;
    child_comment_map: {
      comment_id: number;
      comment_content: string;
      comment_user_id: number;
      comment_username: string;
      comment_date: string;
    }[];
  }[];
  navigation: any;
  setout_of_main: Function;
};
type bb死ね死ね = {
  asd: Function;
};
const BB死ね死ね = ({ asd }: bb死ね死ね) => {
  const [add_comment_textarea_content, setadd_comment_textarea_content] =
    useState("");
  return (
    <View>
      <Add_comment_textarea_box>
        <Add_comment_textarea_dummy>
          {add_comment_textarea_content + "\u200b"}
        </Add_comment_textarea_dummy>
        <Add_comment_textarea
          style={{
            textAlignVertical: "top",
          }}
          value={add_comment_textarea_content}
          multiline={true}
          placeholder={"コメントを書く"}
          max_length={500}
          onChangeText={(inputed_comment: string) => {
            let new_comment = censor_content(inputed_comment);
            if (inputed_comment.length >= 500) {
              new_comment = new_comment.slice(0, 500);
            }
            setadd_comment_textarea_content(new_comment);
          }}
        />
      </Add_comment_textarea_box>
      <Add_comment_button
        onPress={() => {
          asd(add_comment_textarea_content);
        }}
      >
        <Add_comment_button_text>投稿</Add_comment_button_text>
      </Add_comment_button>
    </View>
  );
};
function Discussion_box_comp({
  parent_content_id,
  comment_data_list,
  navigation,
  setout_of_main,
}: discussion_box_comp_props) {
  discussion_box_ref = useRef(null);
  const [post_comment_processing_flag, setpost_comment_processing_flag] =
    useState(false);

  return (
    <Gray_out_page
      onPress={() => {
        close_discussion_box(setout_of_main);
      }}
    >
      <StatusBar style="dark" />
      <View>
        <Discussion_box ref={discussion_box_ref}>
          <BB死ね死ね
            asd={(asd死ね: string) => {
              if (post_comment_processing_flag == false) {
                setpost_comment_processing_flag(true);
                post_comment(parent_content_id, 0, asd死ね).then(
                  (data: any) => {
                    setpost_comment_processing_flag(false);
                    if (data["result"] == "success") {
                      open_discussion_box(
                        parent_content_id,
                        navigation,
                        setout_of_main,
                        {
                          move_to_latest_comment_flag: true,
                          open_parent_comment_id: 0,
                        }
                      );
                    } else if (data["result"] == "incorrect_session_error") {
                    } else {
                      showalert(
                        "エラー",
                        `エラーコード:冷風扇の風は冷風機能offでも扇風機より涼しい\n\n読み込み直しても同じエラーが出るときは運営にエラーコードと共に伝えてください。`
                      );
                    }
                  }
                );
              }
            }}
          />
          {comment_data_list.map((comment_data) => (
            <Parent_comment
              setout_of_main={setout_of_main}
              parent_content_id={parent_content_id}
              comment_data={comment_data}
              key={comment_data.comment_id}
              navigation={navigation}
            />
          ))}
        </Discussion_box>
        <Close_discussion_box_button
          onPress={() => {
            close_discussion_box(setout_of_main);
          }}
        >
          <Close_discussion_box_button_base />
        </Close_discussion_box_button>
      </View>
    </Gray_out_page>
  );
  /*else {
    return (
      <Gray_out_page>
        <StatusBar style="dark" />
        <View>
          <Discussion_box>
            <Add_comment_textarea_box>
              <Add_comment_textarea_dummy>
                {add_comment_textarea_content + "\u200b"}
              </Add_comment_textarea_dummy>
              <Add_comment_textarea
                style={{
                  textAlignVertical: "top",
                }}
                value={add_comment_textarea_content}
                multiline={true}
                placeholder={"コメントを書く"}
                onChangeText={(inputed_comment: string) => {
                  setadd_comment_textarea_content(
                    censor_content(inputed_comment)
                  );
                }}
              />
            </Add_comment_textarea_box>
            <Add_comment_button
              onPress={() => {
                post_comment(
                  parent_content_id,
                  0,
                  add_comment_textarea_content
                ).then((data: any) => {
                  if (data["result"] == "success") {
                    open_discussion_box(
                      parent_content_id,
                      navigation,
                      setout_of_main,
                      {}
                    );
                  }
                });
              }}
            >
              <Add_comment_button_text>投稿</Add_comment_button_text>
            </Add_comment_button>
          </Discussion_box>
          <Close_discussion_box_button
            onPress={() => {
              setout_of_main(<View />);
            }}
          ><Close_discussion_box_button_base/>
          </Close_discussion_box_button>
        </View>
      </Gray_out_page>
    );
  }*/
}
function open_discussion_box(
  content_id: Number,
  navigation: any,
  setout_of_main: Function,
  { move_to_latest_comment_flag = false, open_parent_comment_id = 0 }
) {
  let request_json_data = {
    content_id: String(content_id),
  };
  fetch(site_url + "get_discussion_data/", {
    method: "post",
    headers: {
      "Content-Type": "application/json", //JSON形式のデータのヘッダー
    },
    body: JSON.stringify(request_json_data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data["result"] == "success") {
        let amount_of_displayd_comment = Number(
          data["amount_of_displayd_comment"]
        );
        let comment_map: {
          comment_id: number;
          comment_content: string;
          comment_user_id: number;
          comment_username: string;
          comment_date: string;
          deleted_flag: boolean;
          child_comment_map: {
            comment_id: number;
            comment_content: string;
            comment_user_id: number;
            comment_username: string;
            comment_date: string;
          }[];
        }[] = [];
        if (amount_of_displayd_comment >= 1) {
          let comment_id_list = data["comment_id_combined"].split("<");
          let comment_content_list: string[] =
            data["comment_content_combined"].split("<");
          let parent_comment_id_list =
            data["parent_comment_id_combined"].split("<");
          let comment_user_id_list =
            data["comment_user_id_combined"].split("<");
          let comment_username_list: string[] =
            data["comment_username_combined"].split("<");
          let comment_date_list_list = data["comment_date_combined"].split("<");
          let deleted_flag_str_combined =
            data["deleted_flag_combined"].split("<");
          interface int_dict {
            [index: number]: number;
          }
          let parent_comment_id_to_index_dict: int_dict = {};
          for (let i = 0; i < amount_of_displayd_comment; i++) {
            let parent_comment_id = Number(parent_comment_id_list[i]);
            let comment_date_list = comment_date_list_list[i].split(",");
            if (parent_comment_id == 0) {
              parent_comment_id_to_index_dict[comment_id_list[i]] =
                comment_map.length;
              comment_map[comment_map.length] = {
                comment_id: Number(comment_id_list[i]),
                comment_content: comment_content_list[i],
                comment_user_id: Number(comment_user_id_list[i]),
                comment_username: comment_username_list[i],
                comment_date: `投稿日 ${comment_date_list[0]}年${comment_date_list[1]}月${comment_date_list[2]}日${comment_date_list[3]}時${comment_date_list[4]}分`,
                deleted_flag: deleted_flag_str_combined[i] == "y",
                child_comment_map: [],
              };
            } else if (parent_comment_id >= 1) {
              let parent_comment_index =
                parent_comment_id_to_index_dict[parent_comment_id];
              comment_map[parent_comment_index].child_comment_map[
                comment_map[parent_comment_index].child_comment_map.length
              ] = {
                comment_id: Number(comment_id_list[i]),
                comment_content: comment_content_list[i],
                comment_user_id: Number(comment_user_id_list[i]),
                comment_username: comment_username_list[i],
                comment_date: `投稿日 ${comment_date_list[0]}年${comment_date_list[1]}月${comment_date_list[2]}日${comment_date_list[3]}時${comment_date_list[4]}分`,
              };
            }
          }
          if (move_to_latest_comment_flag) {
            if (open_parent_comment_id == 0) {
              move_comment_id = comment_map[comment_map.length - 1].comment_id;
            } else {
              move_comment_id =
                comment_map[
                  parent_comment_id_to_index_dict[open_parent_comment_id]
                ].child_comment_map[
                  comment_map[
                    parent_comment_id_to_index_dict[open_parent_comment_id]
                  ].child_comment_map.length - 1
                ].comment_id;
            }
          } else {
            move_comment_id = 0;
          }
          setout_of_main(
            <Discussion_box_comp
              parent_content_id={content_id}
              navigation={navigation}
              comment_data_list={comment_map}
              setout_of_main={setout_of_main}
            />
          );
        } else {
          setout_of_main(
            <Discussion_box_comp
              parent_content_id={content_id}
              navigation={navigation}
              comment_data_list={comment_map}
              setout_of_main={setout_of_main}
            />
          );
        }
      } else {
        showalert(
          "エラー",
          "エラーコード:大阪行ったことない\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
        );
      }
    })
    .catch((error) => {
      console.log(error);
      showalert(
        "通信エラー",
        "エラーコード:国会、司法、軍隊。大日本帝国の三権分立\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
      );
    });
}

function close_discussion_box(setout_of_main: Function) {
  comment_id_ref_dict = {};
  setout_of_main(<View />);
}

type post_props = {
  post_data: {
    content_id: number;
    user_id: number;
    username: string;
    title: string;
    date: string;
    overview: string;
    content: string;
    tag_dict_list: {
      tag_number: number;
      tag_content: string;
    }[];
    my_review: string;
    like_count: number;
    dislike_count: number;
  };
  setout_of_main: Function;
  navigation: any;
  my_post_flag?: boolean;
  begin_open_content?: boolean;
  tag_function?: Function;
};
const Post_box: React.FC<post_props> = ({
  post_data,
  setout_of_main,
  navigation,
  my_post_flag = false,
  begin_open_content = false,
  tag_function = (tag: string) => {
    const resetAction = CommonActions.reset({
      index: 0, // 初期スタックのインデックス
      routes: [{ name: "Search_page", params: { search_words: tag } }],
    });
    navigation.dispatch(resetAction);
  },
}) => {
  const Post_display_box = styled.View`
    position: relative;
    border-top-width: ${v_w(0.8)}px;
    border-top-color: rgba(90, 155, 166, 0.5);
    margin-bottom: ${v_w(2.0)}px;
    width: 95%;
    left: 2.5%;
    padding-top: ${v_w(0.0)}px;
    padding-bottom: ${v_w(0.0)}px;
    background-color: white;
  `;

  const Post_box_left = styled.View`
    position: absolute;
    vertical-align: top;
    left: 0%;
    width: 12%;
  `;

  const Post_box_right = styled.View`
    position: relative;
    vertical-align: top;
    text-align: left;
    left: 12%;
    width: 84%;
    padding-top: ${v_w(5.0)}px;
  `;

  const Listed_post_username_box = styled.TouchableOpacity`
    text-align: left;
    left: ${v_w(0.5)}px;
    top: ${v_w(0.0)}px;
    position: absolute;
  `;

  const Listed_post_username = styled(General_text)`
    font-size: ${v_w(3)}px;
    color: #555555;
  `;

  const Listed_post_icon_box = styled.TouchableOpacity`
    text-align: right;
    margin-top: ${v_w(0.5)}px;
    width: ${v_w(11.0)}px;
    height: ${v_w(11.0)}px;
  `;

  const Listed_post_icon = styled.Image`
    width: ${v_w(11.0)}px;
    height: ${v_w(11.0)}px;
  `;

  const Post_title_button = styled.TouchableOpacity``;

  const Post_title = styled(General_text)`
    font-weight: bold;
    text-align: left;
    position: relative;
    left: ${v_w(4.0)}px;
    font-size: ${v_w(3.5)}px;
    color: #41717c;
  `;

  const Post_date = styled(General_text)`
    color: #555555;
    left: 0;
    top: 0px;
    left: ${v_w(4.0)}px;
    font-size: ${v_w(2.0)}px;
    position: relative;
    margin-bottom: ${v_w(1.0)}px;
  `;

  const Post_overview = styled(General_text)`
    color: #555555;
    margin-left: ${v_w(4.0)}px;
    width: ${v_w(70.0)}px;
    margin-bottom: ${v_w(2.0)}px;
    text-align: left;
    font-size: ${v_w(3.0)}px;
  `;

  const Post_content_box = styled.View`
    width: 90%;
    left: 5%;
    border-top-width: 1px;
    border-top-color: #e0e0e0;
  `;

  const Post_content = styled(General_text)`
    color: #555555;
    text-align: left;
    padding-left: ${v_w(0.0)}px;
    padding-right: ${v_w(0.0)}px;
    position: relative;

    margin-top: ${v_w(0.5)}px;
    padding: ${v_w(0.8)}px;
    margin-left: 0px;
    width: 100%;
    font-size: ${v_w(3.2)}px;
  `;

  const Post_content_space = styled.View`
    height: ${v_w(1.0)}px;
  `;

  const Open_content_button = styled(General_button)`
    margin-right: auto;
    margin-left: auto;
    width: ${v_w(30)}px;
    height: ${v_w(8.0)}px;
    border-radius: ${v_w(2.0)}px;
    background-color: #ffffff;
    border-color: #5a9fa6;
    border-width: ${v_w(0.6)}px;
    margin-bottom: ${v_w(2)}px;
  `;

  const Open_content_button_text = styled(General_text)`
    line-height: ${v_w(8.0)}px;
    text-align: center;
    color: #41717c;
    font-size: ${v_w(4.5)}px;
    margin-top: ${v_w(-0.6)}px;
  `;

  const Post_content_button_box = styled.View`
    text-align: right;
    display: block;
    height: ${v_w(8.0)}px;
    width: 100%;
    border-top-width: 1px;
    border-top-color: #e0e0e0;
    border-bottom-width: 1px;
    border-bottom-color: #e0e0e0;
  `;

  const Like_button = styled.TouchableOpacity`
    display: block;
    position: absolute;
    margin-top: ${v_w(0.0)}px;
    height: ${v_w(8.0)}px;
    left: 5.5%;
    width: 20%;
    text-align: left;
    border-right-width: 1px;
    border-right-color: #e0e0e0;
  `;

  const like_button_svg_normal = (props: SvgProps) => (
    <Svg
      width={v_w(6)}
      height={v_w(6)}
      fill="none"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={2}
      aria-labelledby="thumbUpIconTitle"
      color="#2329D6"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="M8 8.74a2 2 0 0 1 .481-1.302l4.791-5.59A1.432 1.432 0 0 1 15 1.5c.574.287.85.952.646 1.56L14 8h4.604a2 2 0 0 1 1.967 2.358l-1.272 7A2 2 0 0 1 17.33 19H10a2 2 0 0 1-2-2V8.74ZM4 18V9" />
    </Svg>
  );

  const like_button_svg_liked = (props: SvgProps) => (
    <Svg
      width={v_w(6)}
      height={v_w(6)}
      fill="#41717c"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={2}
      aria-labelledby="thumbUpIconTitle"
      color="#2329D6"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="M8 8.74a2 2 0 0 1 .481-1.302l4.791-5.59A1.432 1.432 0 0 1 15 1.5c.574.287.85.952.646 1.56L14 8h4.604a2 2 0 0 1 1.967 2.358l-1.272 7A2 2 0 0 1 17.33 19H10a2 2 0 0 1-2-2V8.74ZM4 18V9" />
    </Svg>
  );

  const Like_button_svg_normal = styled(like_button_svg_normal)`
    position: absolute;
    top: ${v_w(0.9)}px;
    left: ${v_w(2.0)}px;
    height: ${v_w(6.0)}px;
    width: ${v_w(6.0)}px;
  `;

  const Like_button_svg_liked = styled(like_button_svg_liked)`
    position: absolute;
    top: ${v_w(0.9)}px;
    left: ${v_w(2.0)}px;
    height: ${v_w(6.0)}px;
    width: ${v_w(6.0)}px;
  `;

  const Like_dislike_count_text = styled(General_text)`
    color: #555555;
    position: absolute;
    right: ${v_w(3.0)}px;
    font-size: ${v_w(3.5)}px;
    line-height: ${v_w(8.0)}px;
  `;

  const Dislike_button = styled.TouchableOpacity`
    display: block;
    position: absolute;
    margin-top: ${v_w(0.0)}px;
    height: ${v_w(8.0)}px;
    left: 25.5%;
    width: 20%;
    text-align: left;
    border-right-width: 1px;
    border-right-color: #e0e0e0;
  `;

  const dislike_button_svg_normal = (props: SvgProps) => (
    <Svg
      width={v_w(6)}
      height={v_w(6)}
      fill="none"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={2}
      aria-labelledby="thumbDownIconTitle"
      color="#2329D6"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="M16 15.26a2 2 0 0 1-.481 1.302l-4.791 5.59A1.432 1.432 0 0 1 9 22.5a1.29 1.29 0 0 1-.646-1.56L10 16H5.396a2 2 0 0 1-1.967-2.358l1.272-7A2 2 0 0 1 6.67 5H14a2 2 0 0 1 2 2v8.26ZM20 15V6" />
    </Svg>
  );

  const dislike_button_svg_disliked = (props: SvgProps) => (
    <Svg
      width={v_w(6)}
      height={v_w(6)}
      fill="#41717c"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={2}
      aria-labelledby="thumbDownIconTitle"
      color="#2329D6"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="M16 15.26a2 2 0 0 1-.481 1.302l-4.791 5.59A1.432 1.432 0 0 1 9 22.5a1.29 1.29 0 0 1-.646-1.56L10 16H5.396a2 2 0 0 1-1.967-2.358l1.272-7A2 2 0 0 1 6.67 5H14a2 2 0 0 1 2 2v8.26ZM20 15V6" />
    </Svg>
  );

  const Dislike_button_svg_normal = styled(dislike_button_svg_normal)`
    position: absolute;
    top: ${v_w(0.5)}px;
    left: ${v_w(2.0)}px;
    height: ${v_w(6.0)}px;
    width: ${v_w(6.0)}px;
  `;

  const Dislike_button_svg_disliked = styled(dislike_button_svg_disliked)`
    position: absolute;
    top: ${v_w(0.5)}px;
    left: ${v_w(2.0)}px;
    height: ${v_w(6.0)}px;
    width: ${v_w(6.0)}px;
  `;

  const Open_comment_button = styled.TouchableOpacity`
    position: absolute;
    margin-top: ${v_w(0.0)}px;
    left: 45.5%;
    width: 35%;
    height: ${v_w(8.0)}px;
    border-right-width: 1px;
    border-right-color: #e0e0e0;
  `;

  const comment_svg = (props: SvgProps) => (
    <Svg
      width={v_w(8)}
      height={v_w(8)}
      fill="none"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={1.3}
      aria-labelledby="chatIconTitle"
      color="#2329D6"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="M8.824 18.588 4 21l.653-4.573C3.006 15.001 2 13.095 2 11c0-4.418 4.477-8 10-8s10 3.582 10 8-4.477 8-10 8c-1.11 0-2.178-.145-3.176-.412Z" />
    </Svg>
  );

  const Comment_svg = styled(comment_svg)`
    transform: scale(-1, 1);
    position: absolute;
    left: ${v_w(2)}px;
  `;

  const Open_comment_button_text = styled(General_text)`
    left: ${v_w(13)}px;
    position: absolute;
    font-size: ${v_w(3.5)}px;
    line-height: ${v_w(8.0)}px;
    color: #5a9fa6;
  `;

  const Report_button = styled.TouchableOpacity`
    position: absolute;
    margin-top: ${v_w(0.0)}px;
    left: 80.5%;
    width: 19.5%;
    height: ${v_w(6.0)}px;
  `;

  const Report_button_text = styled(General_text)`
    font-size: ${v_w(3.5)}px;
    line-height: ${v_w(8.0)}px;
    text-align: center;
    color: #5a9fa6;
  `;

  const Delete_button = styled(Report_button)`
    background-color: red;
    color: #598994;
    height: ${v_w(8.0)}px;
  `;

  const Delete_button_text = styled(Report_button_text)`
    color: #ffffff;
  `;

  const Tags_box = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: left;
    flex-wrap: wrap;
    border-radius: ${v_w(0.0)}px;
    border-bottom-width: 1px;
    border-bottom-color: #e0e0e0;
    margin: 0% 0%;
    padding: ${v_w(0.5)}px ${v_w(0.2)}px;
    align-items: center;
    margin-bottom: ${v_w(0)}px;
  `;

  const Post_tag = styled.TouchableOpacity`
    margin-left: ${v_w(2)}px;
    top: ${v_w(0)}px;
    font-size: ${v_w(3.5)}px;
    text-decoration: none;
    color: #598994;
  `;

  const Tag_text = styled(General_text)`
    font-size: ${v_w(3.5)}px;
    text-decoration: none;
    color: #598994;
  `;
  const [alredy_view_flag, setalredy_view_flag] = useState(false);
  const [content_open_flag, setcontent_open_flag] = useState(false);
  const [content_comp, setcontent_comp] = useState(<View />);
  const [open_content_button_text_text, setopen_content_button_text_text] =
    useState("読む");
  const [additional_open_content_button, setadditional_open_content_button] =
    useState(<View></View>);
  const [like_count_value, setlike_count_value] = useState(
    post_data.like_count
  );
  const [like_image, setlike_image] = useState(
    post_data.my_review == "liked" ? (
      <Like_button_svg_liked />
    ) : (
      <Like_button_svg_normal />
    )
  );
  const [dislike_count_value, setdislike_count_value] = useState(
    post_data.dislike_count
  );
  const [dislike_image, setdislike_image] = useState(
    post_data.my_review == "disliked" ? (
      <Dislike_button_svg_disliked />
    ) : (
      <Dislike_button_svg_normal />
    )
  );
  const [image_loaded_flag, setimage_loaded_flag] = useState(false);
  let content_split = post_data.content.split(">");
  let image_count = Math.floor((content_split.length - 1) / 2);
  let content_with_image_list_minus_1: {
    content_text: string;
    image_number: number;
    image_number_with_extension: string;
  }[] = [];
  if (image_count >= 1) {
    for (let i = 0; i < image_count; i++) {
      content_with_image_list_minus_1[i] = {
        content_text: content_split[2 * i],
        image_number: i + 1,
        image_number_with_extension: content_split[2 * i + 1],
      };
    }
  }
  function open_close_content() {
    if (content_open_flag == false) {
      setcontent_open_flag(true);
      if (alredy_view_flag == false) {
        setalredy_view_flag(true);
        if (user_id >= 1) {
          let call_by_view_request = new XMLHttpRequest();
          call_by_view_request.open(
            "POST",
            site_url + "view_count_doubleplus/app/",
            true
          );
          call_by_view_request.setRequestHeader(
            "Content-Type",
            "application/json"
          );
          let request_json_data = {
            content_id: String(post_data.content_id),
          };
          request_json_data = Object.assign(
            request_json_data,
            get_session_datas()
          );
          call_by_view_request.send(JSON.stringify(request_json_data));
        }
      }
      if (image_count == 0) {
        setcontent_comp(
          <Post_content_box>
            <Post_content>{post_data.content}</Post_content>
          </Post_content_box>
        );
      } else if (image_count >= 1) {
        setcontent_comp(
          <Post_content_box>
            {content_with_image_list_minus_1.map((content_and_image) => (
              <View
                key={
                  String(post_data.content_id) +
                  "_image_" +
                  String(content_and_image.image_number)
                }
              >
                {content_and_image.content_text == "" ? (
                  <Post_content_space />
                ) : (
                  <Post_content>{content_and_image.content_text}</Post_content>
                )}
                <Image_with_aspect_ratio
                  image_url={
                    site_url +
                    `media/content_image/${post_data.content_id}/${content_and_image.image_number_with_extension}`
                  }
                  width_percentage={50}
                />
              </View>
            ))}
            {content_split[2 * image_count] == "" ? (
              <View />
            ) : (
              <Post_content>{content_split[2 * image_count]}</Post_content>
            )}
          </Post_content_box>
        );
      }
      setopen_content_button_text_text("閉じる");
      /*setadditional_open_content_button(
        <Open_content_button
          onPress={() => {
            setcontent_open_flag(false);
            setcontent_comp(<View></View>);
            setopen_content_button_text_text("読む");
            setadditional_open_content_button(<View></View>);
          }}
        >
          <Open_content_button_text>閉じる</Open_content_button_text>
        </Open_content_button>
      );*/
    } else {
      setcontent_open_flag(false);
      setcontent_comp(<View></View>);
      setopen_content_button_text_text("読む");
      setadditional_open_content_button(<View></View>);
    }
  }

  let delete_count = 0;
  useEffect(() => {
    delete_count = 0;
    if (begin_open_content) {
      open_close_content();
    }
    return () => {
      delete_count = 0;
    };
  }, []);
  const post_ref: any = useRef(null);
  function delete_post() {
    if (delete_count <= 4) {
      showalert("", `後${5 - delete_count}回押したら削除されます`);
      delete_count++;
    } else {
      let session_datas = get_session_datas();
      let request_json_data = { content_id: String(post_data.content_id) };
      request_json_data = Object.assign(session_datas, request_json_data);
      fetch(site_url + "delete_post_process/app/", {
        method: "post",
        headers: {
          "Content-Type": "application/json", //JSON形式のデータのヘッダー
        },
        body: JSON.stringify(request_json_data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["result"] == "success") {
            showalert("", "削除に成功しました");
            if (post_ref.current) {
              post_ref.current.setNativeProps({
                style: { display: "none" },
              });
            }
          }
        });
    }
  }
  return (
    <Post_display_box ref={post_ref}>
      <Post_box_left>
        <Listed_post_icon_box
          onPress={() => {
            navigation.navigate("User_page", { user_id: post_data.user_id });
          }}
        >
          <Listed_post_icon
            source={{
              uri:
                site_url +
                `media/user_icons/user_icon_mini_${post_data.user_id}.png`,
            }}
          />
        </Listed_post_icon_box>
      </Post_box_left>
      <Post_box_right>
        <Listed_post_username_box
          onPress={() => {
            navigation.navigate("User_page", { user_id: post_data.user_id });
          }}
        >
          <Listed_post_username>{post_data.username}</Listed_post_username>
        </Listed_post_username_box>
        <Post_title_button
          onPress={() => {
            jump_with_prams(
              "Uni_post_page",
              { content_id: post_data.content_id },
              navigation
            );
          }}
        >
          <Post_title>{post_data.title}</Post_title>
        </Post_title_button>
        <Post_date>{post_data.date}</Post_date>
        <Post_overview>{post_data.overview}</Post_overview>
      </Post_box_right>

      {begin_open_content ? (
        <View />
      ) : (
        <Open_content_button
          onPress={() => {
            open_close_content();
          }}
        >
          <Open_content_button_text>
            {open_content_button_text_text}
          </Open_content_button_text>
        </Open_content_button>
      )}
      {content_comp}
      {additional_open_content_button}
      <Post_content_button_box>
        <Like_button
          onPress={() => {
            if (user_id >= 0) {
              let session_datas = get_session_datas();
              let data = {
                change: "add_like",
                content_id: String(post_data.content_id),
              };
              data = Object.assign(session_datas, data);
              fetch(site_url + "review_post/app/", {
                method: "post",
                headers: {
                  "Content-Type": "application/json", //JSON形式のデータのヘッダー
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data["result"] == "success") {
                    if (data["like"] == "added") {
                      post_data.like_count += 1;
                      setlike_count_value(post_data.like_count);
                      setlike_image(<Like_button_svg_liked />);
                    } else if (data["like"] == "removed") {
                      post_data.like_count -= 1;
                      setlike_count_value(post_data.like_count);
                      setlike_image(<Like_button_svg_normal />);
                    }

                    if (data["dislike"] == "added") {
                      post_data.dislike_count += 1;
                      setdislike_count_value(post_data.dislike_count);
                      setdislike_image(<Dislike_button_svg_disliked />);
                    } else if (data["dislike"] == "removed") {
                      post_data.dislike_count -= 1;
                      setdislike_count_value(post_data.dislike_count);
                      setdislike_image(<Dislike_button_svg_normal />);
                    }
                  } else if (data["result"] == "failed_error") {
                    showalert(
                      "エラー",
                      "エラーコード: 牛タンはおいしい\n\nページを読み込み直してもこのメッセージが出る場合はエラーコードと共に運営に問い合わせてください"
                    );
                  }
                })
                .catch((error) => {
                  showalert(
                    "通信エラー",
                    "エラーコード: スマホを持ちながらスマホを探す\n\n通信状態を確認してください\n通信状態が問題ない状態でもこのエラーがでるなら、運営にエラーコードと共に連絡してください"
                  );
                  console.log(error);
                });
            }
          }}
        >
          {like_image}
          <Like_dislike_count_text>
            {String(like_count_value)}
          </Like_dislike_count_text>
        </Like_button>
        <Dislike_button
          onPress={() => {
            if (user_id >= 0) {
              let session_datas = get_session_datas();
              let data = {
                change: "add_dislike",
                content_id: String(post_data.content_id),
              };
              data = Object.assign(session_datas, data);
              fetch(site_url + "review_post/app/", {
                method: "post",
                headers: {
                  "Content-Type": "application/json", //JSON形式のデータのヘッダー
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data["result"] == "success") {
                    if (data["like"] == "added") {
                      post_data.like_count += 1;
                      setlike_count_value(post_data.like_count);
                      setlike_image(<Like_button_svg_liked />);
                    } else if (data["like"] == "removed") {
                      post_data.like_count -= 1;
                      setlike_count_value(post_data.like_count);
                      setlike_image(<Like_button_svg_normal />);
                    }

                    if (data["dislike"] == "added") {
                      post_data.dislike_count += 1;
                      setdislike_count_value(post_data.dislike_count);
                      setdislike_image(<Dislike_button_svg_disliked />);
                    } else if (data["dislike"] == "removed") {
                      post_data.dislike_count -= 1;
                      setdislike_count_value(post_data.dislike_count);
                      setdislike_image(<Dislike_button_svg_normal />);
                    }
                  } else if (data["result"] == "failed_error") {
                    showalert(
                      "エラー",
                      "エラーコード: 牛タンはおいしい\n\nページを読み込み直してもこのメッセージが出る場合はエラーコードと共に運営に問い合わせてください"
                    );
                  }
                })
                .catch((error) => {
                  showalert(
                    "通信エラー",
                    "エラーコード: 静岡は長すぎる\n\n通信状態を確認してください\n通信状態が問題ない状態でもこのエラーがでるなら、運営にエラーコードと共に連絡してください"
                  );
                  console.log(error);
                });
            }
          }}
        >
          {dislike_image}
          <Like_dislike_count_text>
            {String(dislike_count_value)}
          </Like_dislike_count_text>
        </Dislike_button>
        <Open_comment_button
          onPress={() => {
            let request_json_data = {
              content_id: String(post_data.content_id),
            };
            fetch(site_url + "get_discussion_data/", {
              method: "post",
              headers: {
                "Content-Type": "application/json", //JSON形式のデータのヘッダー
              },
              body: JSON.stringify(request_json_data),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data["result"] == "success") {
                  let amount_of_displayd_comment = Number(
                    data["amount_of_displayd_comment"]
                  );

                  open_discussion_box(
                    post_data.content_id,
                    navigation,
                    setout_of_main,
                    {}
                  );
                } else {
                  alert("エラー");
                }
              });
          }}
        >
          <Comment_svg />
          <Open_comment_button_text>コメント</Open_comment_button_text>
        </Open_comment_button>
        {my_post_flag ? (
          <Delete_button
            onPress={() => {
              delete_post();
            }}
          >
            <Delete_button_text>削除</Delete_button_text>
          </Delete_button>
        ) : (
          <Report_button
            onPress={() => {
              jump_with_prams(
                "Report_page",
                {
                  subject_category: "post",
                  subject_id: post_data.content_id,
                },
                navigation
              );
            }}
          >
            <Report_button_text>通報</Report_button_text>
          </Report_button>
        )}
      </Post_content_button_box>
      <Tags_box>
        {post_data.tag_dict_list.map((tags) => (
          <Post_tag
            onPress={() => {
              tag_function(tags.tag_content);
            }}
            key={tags.tag_number}
          >
            <Tag_text>{"# " + tags.tag_content}</Tag_text>
          </Post_tag>
        ))}
      </Tags_box>
    </Post_display_box>
  );
};
type page_transition_button = {
  page_number: number;
  total_page_number: number;
  search_words: string;
  exclude_words: string;
  order: string;
  setsearch_result: Function;
  setout_of_main: Function;
  navigation: any;
};
function Page_transition_button({
  page_number,
  total_page_number,
  search_words,
  exclude_words,
  order,
  setsearch_result,
  setout_of_main,
  navigation,
}: page_transition_button) {
  const Transition_page_box = styled.View`
    width: ${v_w(30.0)}px;
    height: ${v_w(6.0)}px;
    margin-bottom: ${v_w(4.0)}px;
  `;
  const Current_page_box = styled.View`
    position: absolute;
    left: ${v_w(45.0)}px;
    width: ${v_w(10.0)}px;
    height: ${v_w(6.0) - 0.1}px;
    border-width: ${v_w(0.5)}px;
    border-color: #5a9fa6;
    background-color: white;
    font-size: ${v_w(4.0)}px;
  `;

  const Current_page_box_text = styled(General_text)`
    font-size: ${v_w(4.0)}px;
    color: #ffd580;
    text-align: center;
    line-height: ${v_w(5.2)}px;
  `;
  const Transition_page_button_text = styled(General_text)`
    font-size: ${v_w(4.0)}px;
    color: #5a9fa6;
    text-align: center;
    line-height: ${v_w(5.2)}px;
  `;
  const Previous_page_button = styled.TouchableOpacity`
    position: absolute;
    left: ${v_w(30.0) + 1}px;
    width: ${v_w(15.0)}px;
    height: ${v_w(6.0)}px;
    background-color: white;
    border-width: ${v_w(0.5)}px;
    border-right-width: 0px;
    border-color: #5a9fa6;
    border-top-left-radius: ${v_w(3.0)}px;
    border-bottom-left-radius: ${v_w(3.0)}px;
  `;
  const Next_page_button = styled.TouchableOpacity`
    position: absolute;
    left: ${v_w(55.0)}px;
    width: ${v_w(15.0)}px;
    height: ${v_w(6.0)}px;
    background-color: white;
    color: #41717c;
    border-width: ${v_w(0.5)}px;
    border-left-width: 0px;
    border-color: #5a9fa6;
    font-size: ${v_w(4.0)}px;
    line-height: ${v_w(3.5)}px;
    border-top-right-radius: ${v_w(3.0)}px;
    border-bottom-right-radius: ${v_w(3.0)}px;
  `;
  return (
    <Transition_page_box>
      {page_number != 1 ? (
        <Previous_page_button
          onPress={() => {
            search_post(
              search_words,
              exclude_words,
              order,
              page_number - 1,
              setsearch_result,
              setout_of_main,
              navigation
            );
          }}
        >
          <Transition_page_button_text>
            {String(page_number - 1)}
          </Transition_page_button_text>
        </Previous_page_button>
      ) : (
        <View />
      )}
      {total_page_number != page_number ? (
        <Next_page_button
          onPress={() => {
            search_post(
              search_words,
              exclude_words,
              order,
              page_number + 1,
              setsearch_result,
              setout_of_main,
              navigation
            );
          }}
        >
          <Transition_page_button_text>
            {String(page_number + 1)}
          </Transition_page_button_text>
        </Next_page_button>
      ) : (
        <View />
      )}
      <Current_page_box>
        <Current_page_box_text>{String(page_number)}</Current_page_box_text>
      </Current_page_box>
    </Transition_page_box>
  );
}

function search_post(
  search_words = "",
  exclude_words = "",
  order = "new_post",
  page_number = 1,
  setsearch_result: Function,
  setout_of_main: Function,
  navigation: any
) {
  setsearch_result(<View></View>);
  let request_json_data;
  if (user_id >= 1) {
    let session_datas = get_session_datas();
    request_json_data = {
      page_number: String(page_number),
      search_words: search_words,
      search_words_exclude: exclude_words,
      post_order: order,
    };
    request_json_data = Object.assign(session_datas, request_json_data);
  } else {
    request_json_data = {
      page_number: String(page_number),
      search_words: search_words,
      search_words_exclude: exclude_words,
      post_order: order,
    };
  }
  fetch(site_url + "search_process_app/", {
    method: "post",
    headers: {
      "Content-Type": "application/json", //JSON形式のデータのヘッダー
    },
    body: JSON.stringify(request_json_data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data["result"] == "success") {
        var displayed_post_number = Number(data["amount_of_displayed_post"]);
        if (displayed_post_number == 0) {
          setsearch_result(
            <Search_result_none_text>
              この条件に合う投稿はありません
            </Search_result_none_text>
          );
        } else if (displayed_post_number >= 1) {
          var content_id_list = data["content_id_combined"].split("<");
          var title_list = data["title_combined"].split("<");
          var content_list = data["content_combined"].split("<");
          var user_id_list = data["user_id_combined"].split("<");
          var overview_list = data["overview_combined"].split("<");
          var word_counts_list = data["word_counts_combined"].split("<");
          var tags_list = data["tags_combined"].split("<");
          var my_review_list = data["my_review_combined"].split("<");
          var like_counts_list = data["like_counts_combined"].split("<");
          var dislike_counts_list = data["dislike_counts_combined"].split("<");
          var post_date_list_temp = data["post_date_combined"].split("<");
          var post_date_list: string[][] = [];
          for (let i = 0; i < post_date_list_temp.length; i++) {
            let post_date_temp = post_date_list_temp[i].split(",");
            post_date_list[i] = [];
            for (let j = 0; j < post_date_temp.length; j++) {
              post_date_list[i][j] = post_date_temp[j];
            }
          }
          var user_name_list = data["user_name_combined"].split("<");
          let total_page_number = Number(data["total_page_number"]);
          var post_map = [];
          for (let i = 0; i < displayed_post_number; i++) {
            let tag_list = tags_list[i].split(",");
            let tag_dict_list = [];
            for (let i = 0; i < tag_list.length; i++) {
              tag_dict_list[i] = {
                tag_number: i + 1,
                tag_content: tag_list[i],
              };
            }
            post_map[i] = {
              content_id: Number(content_id_list[i]),
              title: title_list[i],
              content: content_list[i],
              overview: overview_list[i],
              tag_dict_list: tag_dict_list,
              user_id: user_id_list[i],
              username: user_name_list[i],
              my_review: my_review_list[i],
              date: `投稿日 ${post_date_list[i][0]}年${post_date_list[i][1]}月${post_date_list[i][2]}日${post_date_list[i][3]}時${post_date_list[i][4]}分`,
              like_count: Number(like_counts_list[i]),
              dislike_count: Number(dislike_counts_list[i]),
            };
          }

          // Function to toggle visibility
          setsearch_result(
            <View>
              <Page_transition_button
                setsearch_result={setsearch_result}
                setout_of_main={setout_of_main}
                navigation={navigation}
                order={order}
                search_words={search_words}
                exclude_words={exclude_words}
                page_number={page_number}
                total_page_number={total_page_number}
              ></Page_transition_button>
              {post_map.map((post) => (
                <Post_box
                  post_data={post}
                  key={post.content_id}
                  navigation={navigation}
                  my_post_flag={false}
                  setout_of_main={setout_of_main}
                  tag_function={(tag: string) => {
                    exclude_words_entity = "";
                    search_words_entity = tag;
                    search_post(
                      tag,
                      "",
                      "new_post",
                      1,
                      setsearch_result,
                      setout_of_main,
                      navigation
                    );
                  }}
                />
              ))}
              <Page_transition_button
                setsearch_result={setsearch_result}
                setout_of_main={setout_of_main}
                navigation={navigation}
                order={order}
                search_words={search_words}
                exclude_words={exclude_words}
                page_number={page_number}
                total_page_number={total_page_number}
              ></Page_transition_button>
            </View>
          );
        }
      } else {
        showalert(
          "エラー",
          "エラーコード:Javaに後方互換という概念はない\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
        );
      }
    })
    .catch((error: Error) => {
      console.log(error);
      showalert(
        "通信エラー",
        "エラーコード:エラーコードパソコンの電池が壊れた\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
      );
    });
}

type search_page_props = {
  route: any;
  navigation: any;
};
let search_words_entity = "";
let exclude_words_entity = "";
let selected_order = "new_post";
let pre_search_search_word = "";
let alredy_mount_search_page_flag = false;
let search_init_flag = false;
let change_search_word_flag = false;
function Search_page({ route, navigation }: search_page_props) {
  const [search_result, setsearch_result] = useState(<View />);
  const [selected_order_label, setselected_order_label] = useState("新しい順");
  const [out_of_main, setout_of_main] = useState(<View />);
  useFocusEffect(
    useCallback(() => {
      search_init_flag = true;
      /*if (route) {
        if (route.params) {
          if (route.params.search_words) {
            if (route.params.search_words != pre_search_search_word) {
              search_words_entity = route.params.search_words;
              pre_search_search_word = route.params.search_words;
              search_post(
                search_words_entity,
                exclude_words_entity,
                selected_order,
                1,
                setsearch_result,
                setout_of_main,
                navigation
              );
              change_search_word_flag=true
            } else {
              change_search_word_flag=false
            }
          }
        }
      }*/
      return () => {};
    }, [])
  );
  useEffect(() => {
    if (route) {
      if (route.params) {
        if (route.params.search_words) {
          search_words_entity = route.params.search_words;
        }
      }
    }
    search_post(
      search_words_entity,
      exclude_words_entity,
      selected_order,
      1,
      setsearch_result,
      setout_of_main,
      navigation
    );
    return () => {
      search_words_entity = "";
      exclude_words_entity = "";
      selected_order = "new_post";
    };
  }, []); // 空の依存配列を渡すことで、コンポーネントのマウント時にのみ実行されます
  function Search_box_box() {
    let bsd = search_words_entity;
    const [search_words_display, setsearch_words_display] = useState(bsd);
    const [exclude_words_display, setexclude_words_display] =
      useState(exclude_words_entity);
    useFocusEffect(
      useCallback(() => {
        if (search_init_flag) {
          if (route) {
            if (route.params) {
              if (route.params.search_words) {
                if (change_search_word_flag) {
                  search_words_entity = route.params.search_words;
                  pre_search_search_word = route.params.search_words;
                  setsearch_words_display(search_words_entity);
                } else {
                }
              }
            }
          }
          search_init_flag = false;
        }
        return () => {};
      }, [])
    );

    return (
      <Search_box>
        <Search_input_text_box>
          <Search_input_text>検索</Search_input_text>
          <Search_input
            value={search_words_display}
            placeholder="検索ワードを入力"
            onChangeText={(inputed_search_words: string) => {
              setsearch_words_display(inputed_search_words);
              search_words_entity = inputed_search_words;
            }}
          ></Search_input>
        </Search_input_text_box>

        <Search_input_text_box>
          <Search_input_text>除外</Search_input_text>
          <Search_input
            value={exclude_words_display}
            placeholder="除外ワードを入力"
            onChangeText={(inputed_exclude_words: string) => {
              setexclude_words_display(inputed_exclude_words);
              exclude_words_entity = inputed_exclude_words;
            }}
          ></Search_input>
        </Search_input_text_box>

        <Search_order_select_box>
          <Search_order_select_box_text>並び順</Search_order_select_box_text>
          <Open_search_order_select_button
            onPress={() => {
              open_select_option_box({
                setout_of_main: setout_of_main,
                option_list: [
                  { value: "new_post", label: "投稿日(新しい順)" },
                  {
                    value: "like_dislike_ratio_much",
                    label: "平均評価(高い順)",
                  },
                  { value: "view_many_total", label: "閲覧数(多い順)" },
                  { value: "like_count_many", label: "高評価(多い順)" },
                  { value: "dislike_count_many", label: "低評価(多い順)" },
                  { value: "old_post", label: "投稿日(古い順)" },
                  {
                    value: "like_dislike_ratio_little",
                    label: "平均評価(低い順)",
                  },
                  { value: "view_many_few", label: "閲覧数(少ない順)" },
                  { value: "like_count_few", label: "高評価(少ない順)" },
                ],
                selected_option: selected_order,
                option_event: (option: { value: string; label: string }) => {
                  selected_order = option.value;
                  setselected_order_label(option.label);
                },
              });
            }}
          >
            <Open_search_order_select_button_text>
              {selected_order_label}
            </Open_search_order_select_button_text>
          </Open_search_order_select_button>
        </Search_order_select_box>
        <Search_button
          onPress={() => {
            search_post(
              search_words_entity,
              exclude_words_entity,
              selected_order,
              1,
              setsearch_result,
              setout_of_main,
              navigation
            );
          }}
        >
          <Search_button_text>検索</Search_button_text>
        </Search_button>
      </Search_box>
    );
  }
  return (
    <View>
      <Main_base navigation={navigation}>
        <Search_page_box>
          <Search_box_box />
          {search_result}
        </Search_page_box>
      </Main_base>
      {out_of_main}
    </View>
  );
}

const Display_post_pages_label = styled.View`
  height: ${v_w(10.0)}px;
  width: 100%;
`;

const Display_post_pages_label_text = styled(General_text)`
  color: #555555;
  line-height: ${v_w(10.0)}px;
  font-size: ${v_w(5)}px;
  text-align: center;
`;

function View_history_page({ navigation }: navi_props) {
  const [search_result, setsearch_result] = useState(<View />);
  const [out_of_main, setout_of_main] = useState(<View />);
  useEffect(() => {
    let request_json_data;
    if (user_id >= 1) {
      let session_datas = get_session_datas();
      request_json_data = {};
      request_json_data = Object.assign(session_datas, request_json_data);
    } else {
      request_json_data = {
        post_order: "new_post",
        user_id: "-1",
      };
    }
    fetch(site_url + "viewhistory/app/", {
      method: "post",
      headers: {
        "Content-Type": "application/json", //JSON形式のデータのヘッダー
      },
      body: JSON.stringify(request_json_data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["result"] == "success") {
          var displayed_post_number = Number(data["amount_of_displayed_post"]);
          if (displayed_post_number == 0) {
            setsearch_result(
              <Search_result_none_text>
                閲覧履歴はありません
              </Search_result_none_text>
            );
          } else if (displayed_post_number >= 1) {
            var content_id_list = data["content_id_combined"].split("<");
            var title_list = data["title_combined"].split("<");
            var content_list = data["content_combined"].split("<");
            var user_id_list = data["user_id_combined"].split("<");
            var overview_list = data["overview_combined"].split("<");
            var word_counts_list = data["word_counts_combined"].split("<");
            var tags_list = data["tags_combined"].split("<");
            var my_review_list = data["my_review_combined"].split("<");
            var like_counts_list = data["like_counts_combined"].split("<");
            var dislike_counts_list =
              data["dislike_counts_combined"].split("<");
            var post_date_list_temp = data["post_date_combined"].split("<");
            var post_date_list: string[][] = [];
            for (let i = 0; i < post_date_list_temp.length; i++) {
              let post_date_temp = post_date_list_temp[i].split(",");
              post_date_list[i] = [];
              for (let j = 0; j < post_date_temp.length; j++) {
                post_date_list[i][j] = post_date_temp[j];
              }
            }
            var user_name_list = data["user_name_combined"].split("<");
            var post_map = [];
            for (let i = 0; i < displayed_post_number; i++) {
              let tag_list = tags_list[i].split(",");
              let tag_dict_list = [];
              for (let i = 0; i < tag_list.length; i++) {
                tag_dict_list[i] = {
                  tag_number: i + 1,
                  tag_content: tag_list[i],
                };
              }
              post_map[i] = {
                content_id: Number(content_id_list[i]),
                title: title_list[i],
                content: content_list[i],
                overview: overview_list[i],
                tag_dict_list: tag_dict_list,
                user_id: user_id_list[i],
                username: user_name_list[i],
                my_review: my_review_list[i],
                date: `投稿日 ${post_date_list[i][0]}年${post_date_list[i][1]}月${post_date_list[i][2]}日${post_date_list[i][3]}時${post_date_list[i][4]}分`,
                like_count: Number(like_counts_list[i]),
                dislike_count: Number(dislike_counts_list[i]),
              };
            }

            // Function to toggle visibility
            setsearch_result(
              <View>
                {post_map.map((post) => (
                  <Post_box
                    my_post_flag={false}
                    post_data={post}
                    key={post.content_id}
                    navigation={navigation}
                    setout_of_main={setout_of_main}
                  />
                ))}
              </View>
            );
          }
        } else {
          console.log(data["result"]);
          showalert(
            "エラー",
            "エラーコード:何度もエラーコードJavaに後方互換という概念はない\n\n読み込み直しても同じエラーが出る場合はエラーコードと共に運営に連絡してください。"
          );
        }
      })
      .catch((error) => {
        console.log(error);
        showalert(
          "通信エラー",
          "エラーコード:パソコンの電池が壊れた\n\n通信環境が正常なことを確認しても、同じエラーが出る場合はエラーコードと共に運営に連絡してください。"
        );
      });
  }, []);
  return (
    <View>
      <Main_base navigation={navigation}>
        <Search_page_box>
          <Display_post_pages_label>
            <Display_post_pages_label_text>
              閲覧履歴
            </Display_post_pages_label_text>
          </Display_post_pages_label>
          {search_result}
        </Search_page_box>
      </Main_base>
      {out_of_main}
    </View>
  );
}

function Uni_post_page({ route, navigation }: navi_param_props) {
  const [search_result, setsearch_result] = useState(<View />);
  const [out_of_main, setout_of_main] = useState(<View />);
  function open_uni_post() {
    if (route.params.open_comment) {
      open_discussion_box(route.params.content_id, navigation, setout_of_main, {
        move_to_latest_comment_flag: true,
        open_parent_comment_id: route.params.open_parent_comment_id
          ? route.params.open_parent_comment_id
          : 0,
      });
    }

    //setsearch_result(<View></View>);
    let request_json_data = {
      content_id: route.params.content_id,
    };
    let session_datas = get_session_datas();
    request_json_data = request_json_data = Object.assign(
      session_datas,
      request_json_data
    );
    fetch(site_url + "get_uni_post_data/", {
      method: "post",
      headers: {
        "Content-Type": "application/json", //JSON形式のデータのヘッダー
      },
      body: JSON.stringify(request_json_data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["result"] == "success") {
          var displayed_post_number = Number(data["amount_of_displayed_post"]);
          if (displayed_post_number == 0) {
            setsearch_result(
              <Search_result_none_text>
                この条件に合う投稿はありません
              </Search_result_none_text>
            );
          } else if (displayed_post_number >= 1) {
            var content_id_list = data["content_id_combined"].split("<");
            var title_list = data["title_combined"].split("<");
            var content_list = data["content_combined"].split("<");
            var user_id_list = data["user_id_combined"].split("<");
            var overview_list = data["overview_combined"].split("<");
            var word_counts_list = data["word_counts_combined"].split("<");
            var tags_list = data["tags_combined"].split("<");
            var my_review_list = data["my_review_combined"].split("<");
            var like_counts_list = data["like_counts_combined"].split("<");
            var dislike_counts_list =
              data["dislike_counts_combined"].split("<");
            var post_date_list_temp = data["post_date_combined"].split("<");
            var post_date_list: string[][] = [];
            for (let i = 0; i < post_date_list_temp.length; i++) {
              let post_date_temp = post_date_list_temp[i].split(",");
              post_date_list[i] = [];
              for (let j = 0; j < post_date_temp.length; j++) {
                post_date_list[i][j] = post_date_temp[j];
              }
            }
            var user_name_list = data["user_name_combined"].split("<");
            let total_page_number = Number(data["total_page_number"]);
            var post_map = [];
            for (let i = 0; i < displayed_post_number; i++) {
              let tag_list = tags_list[i].split(",");
              let tag_dict_list = [];
              for (let i = 0; i < tag_list.length; i++) {
                tag_dict_list[i] = {
                  tag_number: i + 1,
                  tag_content: tag_list[i],
                };
              }
              post_map[i] = {
                content_id: Number(content_id_list[i]),
                title: title_list[i],
                content: content_list[i],
                overview: overview_list[i],
                tag_dict_list: tag_dict_list,
                user_id: user_id_list[i],
                username: user_name_list[i],
                my_review: my_review_list[i],
                date: `投稿日 ${post_date_list[i][0]}年${post_date_list[i][1]}月${post_date_list[i][2]}日${post_date_list[i][3]}時${post_date_list[i][4]}分`,
                like_count: Number(like_counts_list[i]),
                dislike_count: Number(dislike_counts_list[i]),
              };
            }

            // Function to toggle visibility
            setsearch_result(
              <View>
                {post_map.map((post) => (
                  <Post_box
                    post_data={post}
                    key={post.content_id}
                    navigation={navigation}
                    setout_of_main={setout_of_main}
                    begin_open_content={true}
                  />
                ))}
              </View>
            );
          }
        } else {
          showalert(
            "エラー",
            "エラーコード:唐揚げ増量\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
          );
        }
      })
      .catch((error: any) => {
        console.log(error);
        showalert(
          "通信エラー",
          "エラーコード:日本の中心は東京だけど東京の中心は新宿\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
        );
      });
  }
  useFocusEffect(
    useCallback(() => {
      open_uni_post();
      return () => {
        // 画面がアンフォーカスされたときに実行する処理（オプション）
        //setsearch_result(<View></View>)
      };
    }, [])
  );
  useEffect(() => {
    return () => {
      //setsearch_result(<View></View>)
    };
  }, []); // 空の依存配列を渡すことで、コンポーネントのマウント時にのみ実行されます
  return (
    <View>
      <Main_base navigation={navigation}>
        <Search_page_box>{search_result}</Search_page_box>
      </Main_base>
      {out_of_main}
    </View>
  );
}

function My_post_page({ navigation }: navi_props) {
  const [search_result, setsearch_result] = useState(<View />);
  const [out_of_main, setout_of_main] = useState(<View />);
  function load_data() {
    let request_json_data;
    if (user_id <= 0) {
      navigation.navigate("Login_page");
    }
    let session_datas = get_session_datas();
    request_json_data = {};
    request_json_data = Object.assign(session_datas, request_json_data);
    fetch(site_url + "postedcontent/app/", {
      method: "post",
      headers: {
        "Content-Type": "application/json", //JSON形式のデータのヘッダー
      },
      body: JSON.stringify(request_json_data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["result"] == "success") {
          var displayed_post_number = Number(data["amount_of_displayed_post"]);
          if (displayed_post_number == 0) {
            setsearch_result(
              <Search_result_none_text>
                投稿はありません
              </Search_result_none_text>
            );
          } else if (displayed_post_number >= 1) {
            var content_id_list = data["content_id_combined"].split("<");
            var title_list = data["title_combined"].split("<");
            var content_list = data["content_combined"].split("<");
            var user_id_list = data["user_id_combined"].split("<");
            var overview_list = data["overview_combined"].split("<");
            var word_counts_list = data["word_counts_combined"].split("<");
            var tags_list = data["tags_combined"].split("<");
            var my_review_list = data["my_review_combined"].split("<");
            var like_counts_list = data["like_counts_combined"].split("<");
            var dislike_counts_list =
              data["dislike_counts_combined"].split("<");
            var post_date_list_temp = data["post_date_combined"].split("<");
            var post_date_list: string[][] = [];
            for (let i = 0; i < post_date_list_temp.length; i++) {
              let post_date_temp = post_date_list_temp[i].split(",");
              post_date_list[i] = [];
              for (let j = 0; j < post_date_temp.length; j++) {
                post_date_list[i][j] = post_date_temp[j];
              }
            }
            var user_name_list = data["user_name_combined"].split("<");
            var post_map = [];
            for (let i = 0; i < displayed_post_number; i++) {
              let tag_list = tags_list[i].split(",");
              let tag_dict_list = [];
              for (let i = 0; i < tag_list.length; i++) {
                tag_dict_list[i] = {
                  tag_number: i + 1,
                  tag_content: tag_list[i],
                };
              }
              post_map[i] = {
                content_id: Number(content_id_list[i]),
                title: title_list[i],
                content: content_list[i],
                overview: overview_list[i],
                tag_dict_list: tag_dict_list,
                user_id: user_id_list[i],
                username: user_name_list[i],
                my_review: my_review_list[i],
                date: `投稿日 ${post_date_list[i][0]}年${post_date_list[i][1]}月${post_date_list[i][2]}日${post_date_list[i][3]}時${post_date_list[i][4]}分`,
                like_count: Number(like_counts_list[i]),
                dislike_count: Number(dislike_counts_list[i]),
              };
            }

            // Function to toggle visibility
            setsearch_result(
              <View>
                {post_map.map((post) => (
                  <Post_box
                    my_post_flag={true}
                    post_data={post}
                    key={post.content_id}
                    navigation={navigation}
                    setout_of_main={setout_of_main}
                  />
                ))}
              </View>
            );
          }
        } else {
          console.log(data["result"]);
          showalert(
            "エラー",
            "エラーコード:お腹すいた\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
          );
        }
      })
      .catch((error) => {
        showalert(
          "通信エラー",
          "エラーコード:マウスホイールの調子が悪い\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
        );
      });
  }
  useEffect(() => {
    load_data();
  }, []);
  return (
    <View>
      <Main_base navigation={navigation}>
        <Search_page_box>
          <Display_post_pages_label>
            <Display_post_pages_label_text>
              投稿作品
            </Display_post_pages_label_text>
          </Display_post_pages_label>
          {search_result}
        </Search_page_box>
      </Main_base>
      {out_of_main}
    </View>
  );
}

export { Search_page, View_history_page, My_post_page, Uni_post_page };