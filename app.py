import streamlit as st
import datetime
import pytz  # For time zone!
from streamlit_autorefresh import st_autorefresh

st.set_page_config(page_title="Mirror Clock", page_icon="🕒", layout="centered")

# Set your local timezone
timezone = pytz.timezone("Europe/Berlin")  # Replace with your TZ!

mirror_css = """
<style>
html, body, [data-testid="stAppViewContainer"] {
  height: 100%;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clock {
  display: flex;
  flex-direction: row-reverse;
  font-size: 25em;
  font-family: monospace;
  color: #00FFFF;
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

# Get LOCAL time
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
