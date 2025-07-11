import streamlit as st
import datetime

st.set_page_config(page_title="Mirror Clock", page_icon="🕒", layout="centered")

mirror_css = """
<style>
.clock {
  display: flex;
  flex-direction: row-reverse;
  font-size: 5em;
  font-family: monospace;
  color: #0ff;
}

.digit {
  transform: scaleX(-1);
}

.colon {
  transform: none;
}
</style>
"""

st.markdown(mirror_css, unsafe_allow_html=True)

# 🚨 NEW! Autorefresh every second:
st_autorefresh = st.experimental_rerun if hasattr(st, "experimental_rerun") else None

st_autorefresh = st.experimental_get_query_params if hasattr(st, "experimental_get_query_params") else None

from streamlit_autorefresh import st_autorefresh

st_autorefresh(interval=1000, key="clock_refresh")

now = datetime.datetime.now()
hours = f"{now.hour:02d}"
minutes = f"{now.minute:02d}"

html_clock = f"""
<div class="clock">
  <span class="digit">{hours[0]}</span>
  <span class="digit">{hours[1]}</span>
  <span class="colon">:</span>
  <span class="digit">{minutes[0]}</span>
  <span class="digit">{minutes[1]}</span>
</div>
"""

st.markdown(html_clock, unsafe_allow_html=True)
