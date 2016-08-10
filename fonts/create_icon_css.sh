# cd fontello-a6f36dd3 
grep 'class="i-code"' demo.html | sed -e 's/.*i-name">/./' -e 's/<[^>]*>//g' -e 's/0x/:before { content:"\\/' -e 's/$/"; }/'
# > icon.css
