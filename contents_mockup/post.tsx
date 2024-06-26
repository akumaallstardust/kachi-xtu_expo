import {
  site_url,
  v_w,
  General_button,
  General_input,
  showalert,
  get_session_datas,
  censor_content,
  Image_with_aspect_ratio,
  General_vertical_line,
  navi_props,
  pickImage,
  display_session_error,
  show_question,
  alert_buttom,
  input_content,
  open_select_option_box,
  jump_with_prams,
  bold_status,
  General_text,
  flexble_font_size,
  flexble_px,
  formdata_fetch,
  is_android,
  get_user_id,
  Main_base_no_footer,
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
import { Picker } from "@react-native-picker/picker";
import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components/native";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";
import Svg, { SvgProps, Path, Circle } from "react-native-svg";
import { useFocusEffect, CommonActions } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
namespace Post_page_styles {
  export const Body = styled.ScrollView`
    background-color: #f1f3f5;
    width: 100%;
    height: 100%;
  `;

  export const Post_input_box = styled.View`
    position: relative;
    top: 30px;
    left: 0%;
    width: 100%;
    padding-top: 30px;
    padding-bottom: 200px;
    margin-bottom: 300px;
    border-radius: 40px;
    background-color: #ffffff;
    text-align: left;
  `;

  export const Go_back_button = styled(General_button)`
  position: absolute;
  top: -${flexble_px(30)}
  right: ${flexble_px(5)}
  height: ${flexble_px(100)}
  width: ${flexble_px(100)}
  border-radius: 50%;
  border-width: 8px;
  border-color: #5a9fa6;
  background-color: #ffffff;
`;

  export const go_back_button_svg = (props: SvgProps) => (
    <Svg
      width={"147%"}
      height={"147%"}
      fill="#5a9fa6"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={2}
      aria-labelledby="closeIconTitle"
      color="#2329D6"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="m6.343 6.343 11.314 11.314m-11.314 0L17.657 6.343" />
    </Svg>
  );

  export const Go_back_button_svg = styled(go_back_button_svg)`
  top: -${flexble_px(18)}
  left: -${flexble_px(18)}
  height: ${flexble_px(100)}
  width: ${flexble_px(100)}
`;

  export const Title_input_box = styled.View`
    text-align: center;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  `;

  export const Post_page_vertical_line = styled(General_vertical_line)`
    height: 60px;
    background-color: #5a9fa6;
  `;

  export const Post_page_input_text = styled(General_text)`
    position: relative;
    ${flexble_font_size(28)}
    padding-left: 12px;
    line-height: 60px;
    color: #5a9fa6;
  `;

  export const Title_input = styled(General_input)`
    color: #555555;
    position: relative;
    top: 8px;
    left: 0px;
    height: 60px;
    width: 100%;
    border-width: 0px;
    border-color: #5a9fa6;
    padding-left: 8px;
    ${flexble_font_size(28)}
    background-color: #f5f9fc;
    border-radius: 0px;
  `;

  export const Content_input_box = styled.View`
    position: relative;
    top: 28px;
    left: 5%;
    width: 97%;
    padding-right: ${flexble_px(100)};
  `;

  export const Content_textareas_box = styled.View`
    position: relative;
    top: 8px;
    left: 0px;
    width: 100%;
    border-width: 0px;
    border-color: #5a9fa6;
    margin-bottom: 0px;
    border-radius: 0px;
    background-color: #f5f9fc;
    min-height: 240px;
  `;

  export const Content_image_input_box = styled(Animated.View)`
    position: absolute;
    right: -${flexble_px(80)};
  `;

  export const Content_image_input = styled(General_button)`
  width: ${flexble_px(80)}
  height: ${flexble_px(80)}
`;

  export const content_image_input_svg = (props: SvgProps) => (
    <Svg
      width={"100%"}
      height={"100%"}
      fill="none"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={1.5}
      aria-labelledby="imageIconTitle"
      color="#ffe599"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="M3 3h18v18H3z" />
      <Path strokeLinecap="round" d="m3 14 4-4 11 11" />
      <Circle cx={13.5} cy={7.5} r={2.5} />
      <Path strokeLinecap="round" d="M13.5 16.5 21 9" />
    </Svg>
  );

  export const Content_image_input_svg = styled(content_image_input_svg)`
  width: ${flexble_px(80)}
  height: ${flexble_px(80)}
`;

  export const post_seve_svg = (props: SvgProps) => (
    <Svg
      width={"100%"}
      height={"100%"}
      fill="none"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={1.5}
      aria-labelledby="saveIconTitle"
      color="#ffe599"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="M17.293 3.293 21 7v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12.586a1 1 0 0 1 .707.293Z" />
      <Path d="M7 13h10v8H7zM8 3h8v5H8z" />
    </Svg>
  );

  export const Post_save_box = styled(General_button)`
  width: ${flexble_px(80)}
  height: ${flexble_px(80)}
`;

  export const Post_save_icon_svg = styled(post_seve_svg)`
  width:${flexble_px(80)}
  height: ${flexble_px(80)}
`;

  export const Load_in_production_post_button = styled(General_button)`
  width: ${flexble_px(80)}
  height: ${flexble_px(80)}
`;

  export const load_in_production_post_button_svg = (props: SvgProps) => (
    <Svg
      width={"100%"}
      height={"100%"}
      fill="none"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={1.5}
      aria-labelledby="downloadIconTitle"
      color="#2329D6"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="M12 3v13M7 12l5 5 5-5M20 21H4" />
    </Svg>
  );

  export const Load_in_production_post_button_svg = styled(
    load_in_production_post_button_svg
  )`
  width: ${flexble_px(80)}
  height: ${flexble_px(80)}
`;

  export const Content_textarea_box = styled.View`
    position: relative;
    top: 0px;
    width: 100%;
    background-color: transparent;
  `;

  export const Content_textarea = styled(General_input)`
  background-color: transparent;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  line-height: ${flexble_px(36)}
  padding-left: 8px;
  min-height: 1000000px;
  ${flexble_font_size(28)}
`; //min-height: 1000000px;は絶対必要

  export const Content_textarea_dummy = styled(General_text)`
  background-color: #f5f9fc;
  min-height: ${flexble_px(36)}
  line-height: ${flexble_px(36)}
  padding-left: 8px;
  padding-bottom:12px;
  pointer-events: none;
  width: 100%;
  text-align: left;
  opacity: 0;
  ${flexble_font_size(28)}
`;

  export const Content_textarea_dummy_first = styled(Content_textarea_dummy)`
    min-height: 240px;
  `;

  export const Content_image_box_box = styled.View`
    background-color: #f5f9fc;
    text-align: left;
    width: 100%;
    position: relative;
    margin-top: ${flexble_px(12)};
  `;

  export const Content_image_box = styled.View`
  background-color: #f5f9fc;
  text-align: left;
  width: ${flexble_px(300)}
  max-width:70%;
  position: relative;
  border-width: 0px;
  border-color: #5a9fa6;
`;

  export const Content_image_delete_button = styled(General_button)`
  position: absolute;
  top: -1px;
  right: -${flexble_px(50)}
  width: ${flexble_px(50)}
  height: ${flexble_px(50)}
  border-width: 0px;
  border-color: #5a9fa6;
`;
  export const content_image_delete_button_svg = (props: SvgProps) => (
    <Svg
      width={"100%"}
      height={"100%"}
      fill="#5a9fa6"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={2}
      aria-labelledby="closeIconTitle"
      color="#2329D6"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="m6.343 6.343 11.314 11.314m-11.314 0L17.657 6.343" />
    </Svg>
  );

  export const Content_image_delete_button_svg = styled(
    content_image_delete_button_svg
  )`
top: ${flexble_px(0)}
left: ${flexble_px(0)}
width: 100%;
height: 100%;
`;

  export const Content_textareas_box_bottom_cover = styled.View`
    background-color: transparent;
    position: absolute;
    bottom: -1000000px;
    left: 0px;
    width: 100%;
    min-height: 1000000px;
  `; //min-height: ${v_w(100000.0)}px;は絶対必要

  export const Overview_input_box = styled.View`
    top: 60px;
    text-align: center;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  `;

  export const Overview_textarea_box = styled.View`
    position: relative;
    top: 8px;
    width: 100%;
    background-color: #f5f9fc;
    border-width: 0px;
    border-color: #5a9fa6;
    left: 0px;
    border-radius: 20px;
  `;

  export const Overview_textarea = styled(General_input)`
    background-color: #f5f9fc;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0px;
    padding-left: 8px;
    line-height: 35px;
    ${flexble_font_size(28)}
    color: #555555;
    border-radius: 00px;
  `;

  export const Overview_textarea_dummy = styled(General_text)`
    min-height: 120px;
    background-color: #f5f9fc;
    line-height: 35px;
    padding-left: 8px;
    pointer-events: none;
    width: 100%;
    text-align: left;
    opacity: 0;
    ${flexble_font_size(28)}
    border-radius: 0px;
  `;

  export const Tags_input_box_box = styled.View`
    top: 100px;
    text-align: center;
    width: 95%;
    padding-right: 90px;
    left: 5%;
  `;

  export const Tags_input_box = styled.View`
    position: relative;
    top: 16px;
    left: 0px;
    min-height: 120px;
    width: 100%;
    border-radius: 0px;
    background-color: #ffffff;
    border-width: 0px;
    border-color: #5a9fa6;
    color: #5a9fa6;
    align-items: left;
    padding-top: 0px;
    margin-bottom: 0px;
  `;

  export const Add_tag_button = styled(General_button)`
    position: absolute;
    top: 0px;
    right: -90px;
    width: ${80}px;
    height: ${80}px;
    border-width: 0px;
    border-color: #5a9fa6;
  `;

  export const add_tag_button_svg = (props: SvgProps) => (
    <Svg
      width={60}
      height={60}
      fill="none"
      stroke="#5a9fa6"
      strokeLinecap="square"
      strokeWidth={4}
      aria-labelledby="plusIconTitle"
      color="#2329D6"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path d="M20 12H4m8-8v16" />
    </Svg>
  );

  export const Add_tag_button_svg = styled(add_tag_button_svg)`
    top: -4.5px;
    left: 0px;
    width: 80px;
    height: 80px;
  `;

  export const Tag_input = styled(General_input)`
    position: relative;
    left: 0px;
    height: 50px;
    width: 100%;
    border-width: 0px;
    border-color: #5a9fa6;
    border-radius: 50%;
    padding-left: 25px;
    ${flexble_font_size(24)}
    background-color: #f5f9fc;
    margin-bottom: 24px;
    color: #555555;
  `;

  export const Post_button = styled(General_button)`
    top: 120px;
    width: 240px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 40px;
    background-color: #ffe599;
    border-color: #ffdf80;
    border-width: 5px;
    margin-right: auto;
    margin-left: auto;
  `;
  export const Post_button_text = styled(General_text)`
  ${true?bold_status:""}
    text-align: center;
    ${flexble_font_size(32)}
    height: 60px;
    margin-top: -5px;
    line-height: 60px;
    color: #5a9fa6;
  `;
}

let id = 0;
let saved_flag = true;
var content_split = [`永遠の夕焼けが照らす世界観は、その名の通り一日中夕焼けが続く非現実的で神秘的なアートワークを実現するための世界観です。
この世界観は`]//[``];
var image_count = 0;
var pre_focus_textarea_index = 0;
var pre_textarea_cursor_position = 0;
let image_uri_list: string[] = [];
var image_base64_list: string[] = [];
var image_upload_processing_flag = false;

var tag_count = 1;
var tag_content_list = [""];

type one_tag_input_props = {
  tag_index: number;
};

function One_tag_input({ tag_index }: one_tag_input_props) {
  const [tag_content, settag_content] = useState(tag_content_list[tag_index]);
  const tags_exclusion_pattern = /<|>| |　|,|\u200b|\t|\n|\r/g;
  return (
    <Post_page_styles.Tag_input
      value={tag_content}
      placeholder={"タグを入力(省略可能)"}
      placeholderTextColor={"#b7b7b7"}
      max_length={20}
      onChangeText={(inputed_tag: string) => {
        let new_tag = censor_content(
          inputed_tag,
          false,
          tags_exclusion_pattern
        );
        new_tag.replace(tags_exclusion_pattern, "");
        if (new_tag.length >= 21) {
          new_tag = new_tag.slice(0, 20);
        }
        tag_content_list[tag_index] = new_tag;
        settag_content(new_tag);
      }}
    />
  );
}

type one_content_textarea_props = {
  textarea_index: number;
};
function One_content_textarea({ textarea_index }: one_content_textarea_props) {
  const [parted_content, setparted_content] = useState(
    content_split[textarea_index]
  );
  const [dummy, setdummy] = useState(
    <Post_page_styles.Content_textarea_dummy
      style={{
        paddingBottom:
          textarea_index == image_count
            ? Number(
                flexble_px(12).substring(
                  0,
                  flexble_px(12).length - "px;".length
                )
              )
            : 0,
      }}
    >
      {parted_content + "\u200b"}
    </Post_page_styles.Content_textarea_dummy>
  );
  useEffect(() => {
    setparted_content(content_split[textarea_index]);
    setdummy(
      <Post_page_styles.Content_textarea_dummy>
        {content_split[textarea_index] + "\u200b"}
      </Post_page_styles.Content_textarea_dummy>
    );
    return () => {};
  }, []);
  return (
    <Post_page_styles.Content_textarea_box>
      {textarea_index == 0 && image_count == 0 ? (
        <Post_page_styles.Content_textarea_dummy_first>
          {parted_content + "\u200b"}
        </Post_page_styles.Content_textarea_dummy_first>
      ) : (
        <View>{dummy}</View>
      )}

      <Post_page_styles.Content_textarea
        style={{
          textAlignVertical: "top",
        }}
        onFocus={() => (pre_focus_textarea_index = textarea_index)}
        onSelectionChange={(event: any) =>
          (pre_textarea_cursor_position = event.nativeEvent.selection.start)
        }
        numberOfLines={100000}
        scrollEnabled={false}
        multiline={true}
        value={parted_content}
        placeholder={
          textarea_index == 0 && image_count == 0 ? "内容を入力" : ""
        }
        placeholderTextColor={"#b7b7b7"}
        onChangeText={(inputed_content: string) => {
          let pure_content = "";
          for (let i = 0; i < image_count + 1; i++) {
            pure_content +=
              i == textarea_index
                ? censor_content(inputed_content)
                : content_split[i];
          }
          if (pure_content.length <= 20000) {
            content_split[textarea_index] = censor_content(inputed_content);
            setparted_content(content_split[textarea_index]);
            setdummy(
              <Post_page_styles.Content_textarea_dummy>
                {content_split[textarea_index] + "\u200b"}
              </Post_page_styles.Content_textarea_dummy>
            );
            saved_flag = false;
          }
        }}
      />
    </Post_page_styles.Content_textarea_box>
  );
}

async function set_textareas_box_process(setcontent_textareas: Function) {
  let textarea_and_image_minus1_dict_list = [];
  for (let i = 0; i < image_count; i++) {
    textarea_and_image_minus1_dict_list[
      textarea_and_image_minus1_dict_list.length
    ] = {
      index: i,
    };
  }
  await setcontent_textareas(<View />); //これがなきゃ前のデータが残る なぜかawaitがいる
  setcontent_textareas(
    <View>
      {image_count != 0 ? (
        <View>
          {textarea_and_image_minus1_dict_list.map(
            (textarea_data: { index: number }) => (
              <View key={textarea_data.index}>
                <One_content_textarea textarea_index={textarea_data.index} />
                <Post_page_styles.Content_image_box_box>
                  <Post_page_styles.Content_image_box>
                    <Image_with_aspect_ratio
                      image_url={image_uri_list[textarea_data.index]}
                      width_percentage={100}
                    />
                    <Post_page_styles.Content_image_delete_button
                      onPress={() => {
                        delete_image(textarea_data.index, setcontent_textareas);
                      }}
                    >
                      <Post_page_styles.Content_image_delete_button_svg
                        source={{
                          uri: site_url + `media/close_button.png`,
                        }}
                      />
                    </Post_page_styles.Content_image_delete_button>
                  </Post_page_styles.Content_image_box>
                </Post_page_styles.Content_image_box_box>
              </View>
            )
          )}
        </View>
      ) : (
        <View />
      )}
      <One_content_textarea textarea_index={image_count} />
    </View>
  );
}

async function delete_image(
  image_index: number,
  setcontent_textareas: Function
) {
  if (pre_focus_textarea_index == image_index + 1) {
    pre_focus_textarea_index--;
    pre_textarea_cursor_position += content_split[image_index].length;
  }
  image_uri_list.splice(image_index, 1);
  image_base64_list.splice(image_index, 1);
  content_split[image_index] += content_split[image_index + 1];
  content_split.splice(image_index + 1, 1);
  image_count--;
  set_textareas_box_process((setcontent_textareas = setcontent_textareas));
}

async function insert_image_in_textarea() {
  let new_image_data = await pickImage(1024 * 512);
  if (new_image_data != null) {
    let new_image_uri: string = new_image_data.imageUri;
    let lastDotPosition = new_image_uri.lastIndexOf(".");
    if (lastDotPosition == -1) {
      return new Promise((resolve, reject) => {
        reject({
          result: "bad_extension",
          extension: "ない",
        });
      });
    }
    let extension = new_image_uri.substring(lastDotPosition + 1).toLowerCase();
    if (extension != "png" && extension != "jpg" && extension != "jpeg") {
      return new Promise((resolve, reject) => {
        reject({
          result: "bad_extension",
          extension: extension,
        });
      });
    } else {
      image_uri_list.splice(pre_focus_textarea_index, 0, new_image_uri!);
      image_base64_list.splice(
        pre_focus_textarea_index,
        0,
        new_image_data.base64!
      );
      let front_content = content_split[pre_focus_textarea_index].slice(
        0,
        pre_textarea_cursor_position
      );
      let rear_content = content_split[pre_focus_textarea_index].substring(
        pre_textarea_cursor_position
      );
      content_split[pre_focus_textarea_index] = front_content;
      content_split.splice(pre_focus_textarea_index + 1, 0, rear_content);
      image_count++;
      let response_data = {
        result: "success",
      };
      return new Promise((resolve, reject) => {
        resolve(response_data);
      });
    }
  } else {
    return new Promise((resolve, reject) => {
      reject({
        result: "error",
      });
    });
  }
}
function Post_page({ navigation }: navi_props) {
  const user_id = get_user_id();
  let db: SQLite.SQLiteDatabase;
  async function 死ね() {
    db = await SQLite.openDatabaseAsync("in_production");
    //await db.execAsync(`DROP TABLE IF EXISTS in_production_post_table;`)
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS in_production_post_table(id int,user_id int,title text,content text,overview varchar(500),joined_tags varchar(500),image_count int,images_base64_json json DEFAULT NULL);`
    );
  }
  useFocusEffect(
    useCallback(() => {
      return () => {
        id = 0;
        saved_flag = true;
        content_split = [""];
        image_count = 0;
        pre_focus_textarea_index = 0;
        pre_textarea_cursor_position = 0;
        image_uri_list = [];
        image_base64_list = [];
        image_upload_processing_flag = false;
        tag_count = 1;
        tag_content_list = [""];
        settitle("");
        setoverview("");
        settag_inputs(
          <View style={{ width: "100%" }}>
            <One_tag_input key={0} tag_index={0} />
          </View>
        );
        setadd_tag_input_button(
          <Post_page_styles.Add_tag_button
            onPress={() => {
              tag_count++;
              tag_content_list[tag_content_list.length] = "";
              set_tags();
            }}
          >
            <Post_page_styles.Add_tag_button_svg />
          </Post_page_styles.Add_tag_button>
        );
        setcontent_textareas(<One_content_textarea textarea_index={0} />);
      };
    }, [])
  );
  useEffect(() => {
    死ね();
  }, []);
  const [title, settitle] = useState("永遠の夕焼けが照らす世界");
  const [content_textareas, setcontent_textareas] = useState(
    <One_content_textarea textarea_index={0} />
  );
  const [overview, setoverview] = useState("異世界や夢の中といった現実離れした設定向けの世界観の提案、および注意点の紹介");
  const [scrollY, setScrollY]: any = useState(new Animated.Value(0));
  const textareas_box_ref: any = useRef(null);
  const image_input_box_ref: any = useRef(null);
  const [textareas_box_height, settextareas_box_height] = useState(100000); //大きな値にする

  const [tag_inputs, settag_inputs] = useState(
    <View style={{ width: "100%" }}>
      <One_tag_input key={0} tag_index={0} />
    </View>
  );
  const [add_tag_input_button, setadd_tag_input_button] = useState(
    <Post_page_styles.Add_tag_button
      onPress={() => {
        tag_count++;
        tag_content_list[tag_content_list.length] = "";
        set_tags();
      }}
    >
      <Post_page_styles.Add_tag_button_svg />
    </Post_page_styles.Add_tag_button>
  );
  const [animatedStyle, setanimatedStyle] = useState({
    transform: [{ translateY: scrollY }],
  });
  const [out_of_main, setout_of_main] = useState(<View />);

  async function save_in_production_post() {
    db = await SQLite.openDatabaseAsync("in_production");
    let allrow: { id: number; title: string }[] = await db.getAllAsync(
      `SELECT id,title FROM in_production_post_table where user_id=${user_id} ORDER BY id DESC`
    );
    let new_title = title;
    if (title == "") {
      new_title = "無題の下書き";
    }
    let title_overlap_number = 1;
    let temp_title = new_title;
    for (let i = 0; i < allrow.length; i++) {
      if (allrow[i].title == temp_title && allrow[i].id != id) {
        title_overlap_number++; //こっちが先
        temp_title = new_title + `(${title_overlap_number})`;
        i = -1; //この回が終わったら++されるので0になるように-1
      } else if (i == allrow.length - 1) {
        new_title = temp_title;
      }
    }
    if (id == 0) {
      if (allrow.length == 0) {
        id = 1;
      } else {
        id = allrow[0].id + 1; //mysql-conncterと順番逆
      }
      const result = await db.runAsync(
        "INSERT INTO in_production_post_table (id,user_id,title,content,overview,joined_tags,images_base64_json,image_count) VALUES (?,?,?,?,?,?,?,?)",
        [
          id,
          user_id,
          new_title,
          content_split.join(">"),
          overview,
          tag_content_list.join(","),
          JSON.stringify(image_base64_list),
          image_count,
        ]
      );
      /*`in_production_post_table (
        id int,
        title VARCHAR(200),
        content VARCHAR(50000),
        overview VARCHAR(500),
        joined_tags VARCHAR(500),
        images_base64_json json DEFAULT NULL,
        image_count inst`;*/
    } else {
      await db.runAsync(
        `UPDATE in_production_post_table SET title=?,content=?,overview=?,joined_tags=?,images_base64_json=?,image_count=? WHERE id=?`,
        [
          new_title,
          content_split.join(">"),
          overview,
          tag_content_list.join(","),
          JSON.stringify(image_base64_list),
          image_count,
          id,
        ]
      );
    }
    saved_flag = true;
    alert_buttom({
      setout_of_main: setout_of_main,
      text: "下書きを保存しました",
    });
  }

  async function delete_in_production_post(id: number) {
    return new Promise(async (resolve, reject) => {
      db = await SQLite.openDatabaseAsync("in_production");
      let target_row = await db.getAllAsync(
        `SELECT id FROM in_production_post_table where id=${id};`
      );
      if (target_row.length >= 1) {
        db.runAsync(`DELETE FROM in_production_post_table WHERE id=${id}`);
        resolve("success");
      } else {
        reject("not_exist");
      }
    });
  }

  async function load_in_production_post() {
    db = await SQLite.openDatabaseAsync("in_production");
    let allrow: { id: number; title: string }[] = await db.getAllAsync(
      `SELECT id,title FROM in_production_post_table where user_id=${user_id} ORDER BY id DESC;`
    );
    let converted_dict = allrow.map((item) => ({
      value: item.id,
      label: item.title,
    }));

    const In_production_post_top = styled.View`
      top: 0px;
      right: 0px;
      width: 100%;
      height: ${80}px;
      border-bottom-width: 1px;
      border-color: #aaa;
    `;
    const In_production_post_vertical_line = styled(
      Post_page_styles.Post_page_vertical_line
    )`
      position: absolute;
      top: 8px;
      left: 32px;
    `;
    const In_production_post_top_text = styled(General_text)`
      left: 48px;
      position: absolute;
      text-align: center;
      font-size: 28px;
      line-height: ${80}px;
      color: #5a9fa6;
    `;

    const Delete_in_production_post_button = styled.View`
      position: absolute;
      top: 0px;
      right: 0px;
      width: 60px;
      height: 60px;
      border-radius: 20px;
      border-width: 0px;
      border-color: #5a9fa6;
      color: #ffd580;
    `; //TouchableOpacityではない
    const delete_in_production_post_button_svg = (props: SvgProps) => (
      <Svg
        width={60}
        height={60}
        fill="none"
        stroke="#ffd580"
        strokeLinecap="square"
        strokeWidth={1.5}
        aria-labelledby="binIconTitle"
        color="#ffd580"
        viewBox="0 0 24 24"
        {...props}
      >
        <Path d="M19 6H5m9-1h-4m-4 5v10c0 .667.333 1 1 1h10c.667 0 1-.333 1-1V10" />
      </Svg>
    );

    const Delete_in_production_post_button_svg = styled(
      delete_in_production_post_button_svg
    )``;
    async function 死ね死ね死ね(option: { value: number; label: string }) {
      let loaded_post: {
        id: number;
        title: string;
        content: string;
        overview: string;
        joined_tags: string;
        image_count: number;
        images_base64_json: string;
      } | null = await db.getFirstAsync(
        `SELECT * FROM in_production_post_table where id=${option.value}`
      );
      if (loaded_post) {
        id = loaded_post.id;
        settitle(loaded_post.title);
        setoverview(loaded_post.overview);
        content_split = loaded_post.content.split(">");
        tag_content_list = loaded_post.joined_tags.split(",");
        tag_count = tag_content_list.length;
        set_tags();
        image_count = loaded_post.image_count;
        image_base64_list = JSON.parse(loaded_post.images_base64_json);
        try {
          image_uri_list = await Promise.all(
            image_base64_list.map(async (base64, index) => {
              if (!base64) {
                throw new Error(
                  `Base64 string at index ${index} is null or undefined`
                );
              }

              // Determine the file extension based on the base64 string
              const fileExtension = base64.includes("data:image/png")
                ? "png"
                : "jpg";
              // Create a file path for temporary storage
              const filePath = `${FileSystem.cacheDirectory}post_image_index_${index}.${fileExtension}`;
              // Save the base64 string to a file
              await FileSystem.writeAsStringAsync(filePath, base64, {
                encoding: FileSystem.EncodingType.Base64,
              });
              // Return the file URI
              return filePath;
            })
          );
        } catch (e: any) {
          console.log(e);
        }
        set_textareas_box_process(setcontent_textareas);
      } else {
        showalert(
          "読み込みエラー",
          "エラーコード:最強の煽り運転対策、戦車に乗る\n\n通信状態を確認してください\n\n通信状態を確認した後もこのメッセージが表示される場合はエラーコードと共に運営に伝えてください。"
        );
      }
      saved_flag = true;
    }
    const No_in_production_post_box = styled.View`
      top: 0px;
      right: 0px;
      width: 100%;
      height: ${80}px;
    `;

    const No_in_production_post_text = styled(General_text)`
      text-align: center;
      ${flexble_font_size(28)}
      line-height: ${80}px;
      color: #555555;
    `;

    open_select_option_box({
      setout_of_main: setout_of_main,
      option_list: converted_dict,
      option_event: 死ね死ね死ね,
      selected_option: id,
      top_comp: (
        <In_production_post_top>
          <In_production_post_vertical_line />
          <In_production_post_top_text>下書き選択</In_production_post_top_text>
        </In_production_post_top>
      ),
      no_option_comp: (
        <No_in_production_post_box>
          <No_in_production_post_text>
            保存された下書きがありません
          </No_in_production_post_text>
        </No_in_production_post_box>
      ),
      right_comp_width: 60,
      right_comp: (
        <Delete_in_production_post_button>
          <Delete_in_production_post_button_svg />
        </Delete_in_production_post_button>
      ),
      right_event: (id: number, ref: any = null) => {
        delete_in_production_post(id).then(() => {
          if (ref) {
            if (ref.current) {
              ref.current.setNativeProps({
                style: { display: "none" },
              });
            }
          }
        });
      },
    });
  }

  function image_input() {
    if (image_upload_processing_flag == false) {
      image_upload_processing_flag = true;
      insert_image_in_textarea()
        .then((data: any) => {
          if (data["result"] == "success") {
            //大前提としてnew_image_count>=1
            set_textareas_box_process(setcontent_textareas);
            image_upload_processing_flag = false;
          }
        })
        .catch((error_data) => {
          if ((error_data.result = "error")) {
            /*showalert(
        "エラー",
        `エラーコード:リニアはとても速い\n\nファイルの読み込み時にエラーが発生しました\n使用できるファイルはpngとjpegのみです\nファイルが正常でも発生する場合、エラーコードともに運営に伝えてください`
      );*/
            image_upload_processing_flag = false;
          } else if ((error_data.result = "bad_extension")) {
            showalert(
              "",
              `ファイルの読み込み時にエラーが発生しました\n使用できるファイルはpngとjpegのみで拡張子が${error_data.extension}のファイルは使えません\nファイルが正常でも発生する場合、エラーコードともに運営に伝えてください`
            );
            image_upload_processing_flag = false;
          } else {
            showalert(
              "エラー",
              `エラーコード:日本海の日の出\n\n読み込み直してもエラーが発生する場合、エラーコードともに運営に伝えてください`
            );
            image_upload_processing_flag = false;
          }
        });
    }
  }

  async function handleScroll(event: any) {
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: false,
    })(event);
    if (scrollY._value <= 0) {
      setanimatedStyle({
        transform: [{ translateY: 0 }],
      });
    } else if (
      textareas_box_height -
        Number(
          flexble_px(240).substring(0, flexble_px(240).length - "px;".length)
        ) <
      scrollY._value
    ) {
      setanimatedStyle({
        transform: [
          {
            translateY:
              textareas_box_height -
              Number(
                flexble_px(240).substring(
                  0,
                  flexble_px(240).length - "px;".length
                )
              ),
          },
        ],
      });
    } else {
      setanimatedStyle({
        transform: [{ translateY: scrollY }],
      });
    }

    if (textareas_box_ref.current) {
      textareas_box_ref.current.measure(
        (fx: any, fy: any, width: any, height: any, px: any, py: any) => {
          settextareas_box_height(height);
        }
      );
    }
  }

  async function set_tags() {
    if (tag_count <= 10) {
      let tag_index_dict_list: { index: number }[];
      tag_index_dict_list = [];
      for (let i = 0; i < tag_count; i++) {
        tag_index_dict_list[i] = { index: i };
      }
      if (tag_count == 10) {
        setadd_tag_input_button(<View />);
      }
      settag_inputs(<View />);
      settag_inputs(
        <View style={{ width: "100%" }}>
          {tag_index_dict_list.map((tag_index_dict: any) => (
            <One_tag_input
              key={tag_index_dict.index}
              tag_index={tag_index_dict.index}
            />
          ))}
        </View>
      );
    } else {
      setadd_tag_input_button(<View />);
    }
  }
  const [post_processing_flag, setpost_processing_flag] = useState(false);

  async function check_and_post() {
    if (post_processing_flag == false) {
      let whole_content = "";
      for (let i = 0; i < image_count; i++) {
        whole_content += content_split[i];
        whole_content += ">" + `${i + 1}` + ">";
      }
      whole_content += content_split[image_count];
      let joined_tags = tag_content_list.join(",");
      if (title == "") {
        showalert("", "タイトルを入力してください");
      } else if (whole_content == "") {
        showalert("", "内容を入力してください");
      } else {
        setpost_processing_flag(true);
        let request_json_data: any = {
          title: title,
          content: whole_content,
          overview: overview,
          joined_tags: joined_tags,
          image_count: String(image_count),
        };
        request_json_data = Object.assign(
          get_session_datas(),
          request_json_data
        );
        let formData: any = new FormData();

        for (let i = 0; i < image_count; i++) {
          await formData.append(`image_file_${i + 1}`, {
            name: `allstardust_project_${i + 1}`,
            uri: is_android
              ? image_uri_list[i]
              : image_uri_list[i].replace("file://", ""),
          });
        }
        formdata_fetch(
          site_url + "post/process/app/",
          formData,
          request_json_data
        )
          .then((data: any) => {
            if (data["result"] == "success") {
              if (id >= 1) {
                delete_in_production_post(id);
              }
              const resetAction = CommonActions.reset({
                index: 0, // 初期スタックのインデックス
                routes: [
                  {
                    name: "Uni_post_page",
                    params: { content_id: Number(data["content_id"]) },
                  },
                ],
              });
              navigation.dispatch(resetAction);
            } else if (data["result"] == "title_overlap") {
              showalert(
                "",
                "既に同じタイトルの投稿が存在します\nタイトルを変えてください"
              );
              setpost_processing_flag(false);
            } else if (data["result"] == "incorrect_session") {
              setpost_processing_flag(false);
              display_session_error(navigation);
            } else {
              setpost_processing_flag(false);
              showalert(
                "エラー",
                "エラーコード:プライバシーポリシーの破壊神\n\n読み込み直しても同じエラーが出る場合エラーコードと共に運営に問い合わせてください"
              );
            }
          })
          .catch((error) => {
            setpost_processing_flag(false);
            showalert(
              "通信エラー",
              "エラーコード:ハイジャック俳人\n\n通信状態を確認してください\n\n通信状態を確認した後もこのメッセージが表示される場合はエラーコードと共に運営に伝えてください。"
            );
            console.log(error);
          });
      }
    } else {
      alert("投稿処理中です");
    }
  }

  return (
    <View>
      <Main_base_no_footer
        scroll_event={(event: any) => {
          handleScroll(event);
        }}
        background_color={"#f1f3f5"}
      >
        <Post_page_styles.Post_input_box>
          <Post_page_styles.Go_back_button
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Post_page_styles.Go_back_button_svg />
          </Post_page_styles.Go_back_button>
          <Post_page_styles.Title_input_box>
            <Post_page_styles.Post_page_vertical_line />
            <Post_page_styles.Post_page_input_text>
              タイトル
            </Post_page_styles.Post_page_input_text>
            <Post_page_styles.Title_input
              value={title}
              placeholder={"タイトルを入力(最大50文字)"}
              placeholderTextColor={"#b7b7b7"}
              max_length={50}
              onChangeText={(inputed_title: string) => {
                input_content(
                  inputed_title,
                  (text: string) => {
                    settitle(text);
                    saved_flag = false;
                  },
                  50
                );
              }}
            />
          </Post_page_styles.Title_input_box>
          <Post_page_styles.Content_input_box>
            <Post_page_styles.Post_page_vertical_line />
            <Post_page_styles.Post_page_input_text>
              内容
            </Post_page_styles.Post_page_input_text>
            <Post_page_styles.Content_textareas_box ref={textareas_box_ref}>
              {content_textareas}
              <Post_page_styles.Content_textareas_box_bottom_cover />
              {/*content_textareasの後でLoad_in_production_post_buttonの前*/}
              <Post_page_styles.Content_image_input_box
                style={animatedStyle}
                ref={image_input_box_ref}
              >
                <Post_page_styles.Content_image_input
                  onPress={() => {
                    image_input();
                  }}
                >
                  <Post_page_styles.Content_image_input_svg
                    source={{
                      uri: site_url + `media/image_upload_icon.png`,
                    }}
                  />
                </Post_page_styles.Content_image_input>
                <Post_page_styles.Post_save_box
                  onPress={() => {
                    save_in_production_post();
                  }}
                >
                  <Post_page_styles.Post_save_icon_svg />
                </Post_page_styles.Post_save_box>
                <Post_page_styles.Load_in_production_post_button
                  onPress={() => {
                    load_in_production_post();
                  }}
                >
                  <Post_page_styles.Load_in_production_post_button_svg />
                </Post_page_styles.Load_in_production_post_button>
              </Post_page_styles.Content_image_input_box>
            </Post_page_styles.Content_textareas_box>
          </Post_page_styles.Content_input_box>
          <Post_page_styles.Overview_input_box>
            <Post_page_styles.Post_page_vertical_line />
            <Post_page_styles.Post_page_input_text>
              概要
            </Post_page_styles.Post_page_input_text>
            <Post_page_styles.Overview_textarea_box>
              <Post_page_styles.Overview_textarea_dummy>
                {overview}
              </Post_page_styles.Overview_textarea_dummy>
              <Post_page_styles.Overview_textarea
                placeholder={"概要を入力(省略可能)"}
                placeholderTextColor={"#b7b7b7"}
                value={overview}
                multiline={true}
                style={{
                  textAlignVertical: "top",
                }}
                max_length={100}
                onChangeText={(inputed_overview: string) => {
                  input_content(
                    inputed_overview,
                    (text: string) => {
                      let matches = text.match(/\n/g);
                      let new_line_count = matches ? matches.length : 0;
                      if (new_line_count >= 3) {
                        let texts = text.split("\n");
                        text = "";
                        for (let i = 0; i < texts.length; i++) {
                          text += texts[i];
                          if (i <= 1) {
                            //二回まで
                            text += "\n"; //new_line_count >= 3なので無条件で改行が足せる
                          }
                        }
                      }
                      setoverview(text);
                      saved_flag = false;
                    },
                    100
                  );
                }}
              />
            </Post_page_styles.Overview_textarea_box>
          </Post_page_styles.Overview_input_box>
          <Post_page_styles.Tags_input_box_box>
            <Post_page_styles.Post_page_vertical_line />
            <Post_page_styles.Post_page_input_text>
              タグ
            </Post_page_styles.Post_page_input_text>
            <Post_page_styles.Tags_input_box>
              {tag_inputs}
              {add_tag_input_button}
            </Post_page_styles.Tags_input_box>
          </Post_page_styles.Tags_input_box_box>
          <Post_page_styles.Post_button
            onPress={() => {
              check_and_post();
            }}
          >
            <Post_page_styles.Post_button_text>
              投稿
            </Post_page_styles.Post_button_text>
          </Post_page_styles.Post_button>
        </Post_page_styles.Post_input_box>
      </Main_base_no_footer>
      {out_of_main}
    </View>
  );
}

export default Post_page;
