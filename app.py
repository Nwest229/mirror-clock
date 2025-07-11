import streamlit as st
import datetime
import time

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

# Display once per rerun
placeholder = st.empty()

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

placeholder.markdown(html_clock, unsafe_allow_html=True)

# Wait 1 second then rerun script
time.sleep(1)
st.experimental_rerun()
