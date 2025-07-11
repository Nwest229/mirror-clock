import streamlit as st
import datetime
import pytz
from streamlit_autorefresh import st_autorefresh

st.set_page_config(page_title="Mirror Clock", page_icon="🕒", layout="wide")

# Your local timezone (example Europe/Berlin)
timezone = pytz.timezone("Europe/Berlin")

mirror_css = """
<style>
html, body, [data-testid="stAppViewContainer"] {
  height: 100%;
  background-color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clock {
  display: flex;
  flex-direction: row-reverse;
  font-size: 25em;
  font-family: monospace;
  color: #000000;
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

# Auto refresh every second
st_autorefresh(interval=1000, key="clockrefresh")

# Get local time
now = datetime.datetime.now(timezone)
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
