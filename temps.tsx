namespace Post_page_styles {
    export const Body = styled.ScrollView`
    background-color: #f1f3f5;
    width: 100%;
    height: 100%;
  `;
  
  export const Post_input_box = styled.View`
    position: relative;
    top: 30px;
    left: 5%;
    width: 90%;
    padding-top: 30px;
    padding-bottom: 200px;
    margin-bottom: 300px;
    border-radius: 40px;
    background-color: #ffffff;
    text-align: left;
  `;
  
  export const Go_back_button = styled(General_button)`
  position: absolute;
    top: -30px;
    right: -30px;
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border-width: 8px;
    border-color: #5a9fa6;
    background-color: #ffffff;
  `;
  
  export const go_back_button_svg = (props: SvgProps) => (
    <Svg
      width={120}
      height={120}
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
    top: -18px;
    left: -18px;
    height: 100px;
    width: 100px;
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
    ${flexible_font_size(28)}
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
    ${flexible_font_size(28)}
    background-color: #f5f9fc;
    border-radius: 0px;
  `;
  
  export const Content_input_box = styled.View`
    position: relative;
    top: 28px;
    left: 5%;
    width: 97%;
    padding-right:100px;
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
    right: -80px;
  `;
  
  export const Content_image_input = styled.TouchableOpacity`
    width: 80px;
    height: 80px;
  `;
  
  export const content_image_input_svg = (props: SvgProps) => (
    <Svg
      width={80}
      height={80}
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
    width: 80px;
    height: 80px;
  `;
  
  export const post_seve_svg = (props: SvgProps) => (
    <Svg
      width={80}
      height={80}
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
  
  export const Post_save_box = styled.TouchableOpacity`
    width: 80px;
    height: 80px;
  `;
  
  export const Post_save_icon_svg = styled(post_seve_svg)`
    width: ${80}px;
    height: ${80}px;
  `;
  
  export const Load_in_production_post_button = styled.TouchableOpacity`
    width: ${80}px;
    height: ${80}px;
  `;
  
  export const load_in_production_post_button_svg = (props: SvgProps) => (
    <Svg
      width={80}
      height={80}
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
    width: ${80}px;
    height: ${80}px;
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
    padding-left: 8px;
    min-height: 1000000px;
    ${flexible_font_size(28)}
  `; //min-height: ${v_w(50000.0)}px;は絶対必要
  
  export const Content_textarea_dummy = styled(General_text)`
    background-color: #f5f9fc;
    min-height: 35px;
    line-height: 35px;
    padding-left: 8px;
    pointer-events: none;
    width: 100%;
    text-align: left;
    opacity: 0;
    ${flexible_font_size(28)}
  `;
  
  export const Content_textarea_dummy_first = styled(Content_textarea_dummy)`
    min-height: 240px;
  `;
  
  export const Content_image_box_box = styled.View`
    background-color: #f5f9fc;
    text-align: left;
    width: 100%;
    position: relative;
  `;
  
  export const Content_image_box = styled.View`
    background-color: #f5f9fc;
    text-align: left;
    width: 70%;
    position: relative;
    border-width: 0px;
    border-color: #5a9fa6;
  `;
  
  export const Content_image_delete_button = styled.TouchableOpacity`
    position: absolute;
    top: -1px;
    right: ${v_w(-8)}px;
    width: ${v_w(8)}px;
    height: ${v_w(8.0)}px;
    border-width: 0px;
    border-color: #5a9fa6;
  `;
  export const content_image_delete_button_svg = (props: SvgProps) => (
    <Svg
      width={v_w(6)}
      height={v_w(6)}
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
  
  export const Content_image_delete_button_svg = styled(content_image_delete_button_svg)`
  top: ${v_w(0.7)}px;
  left: ${v_w(0.7)}px;
  width: ${v_w(6.0)}px;
  height: ${v_w(6.0)}px;
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
    ${flexible_font_size(28)}
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
    ${flexible_font_size(28)}
    border-radius: 0px;
  `;
  
  export const Tags_input_box_box = styled.View`
    top: 100px;
    text-align: center;
    width: 95%;
    padding-right:90px;
    left:5%;
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
    margin-bottom:0px;
  `;
  
  export const Add_tag_button = styled.TouchableOpacity`
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
    ${flexible_font_size(24)}
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
    text-align: center;
    ${flexible_font_size(32)}
    height: 60px;
    margin-top: -5px;
    line-height: 60px;
    color: #5a9fa6;
  `;
  }