import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
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
  General_text,
  pickImage,
  Main_base_no_footer,
} from "./parts";
import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {license} from "../license";
import { Password_input } from "./login_signup";

const License_page = ({ navigation }: navi_props) => {
  const licenseParts = splitText(license, 1000); // テキストを適切な長さに分割します
  function splitText(text: string, size: number) {
    const parts = [];
    for (let i = 0; i < text.length; i += size) {
      parts.push(text.slice(i, i + size));
    }
    return parts;
  }

  return (
    <Main_base navigation={navigation} no_scroll={true}>
      <FlatList
        data={licenseParts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item}</Text>
          </View>
        )}
      />
    </Main_base>
  );
};


export { License_page}