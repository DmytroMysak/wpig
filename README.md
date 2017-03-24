# wpig
Little program to send a text to pig.

# INSTALL
<ul><h2><i>Linux</i></h2>
    <li>Install node if it doesn't exist</li>
    <li>Download or clone repository</li>
    <li>Unzip and rename to wpigFiles</li>
    <li>Open terminal and enter:
        <ul>
            <li>cd {place where is folder wpigFiles}</li>
            <li>mkdir ~/.bashCommand</li>
            <li>mv wpigFiles ~/.bashCommand</li>
            <li>cd ~/.bashCommand && touch wpig"</li>
            <li>echo "node ~/.bashCommand/wpigFiles/wpig.js \$@" > wpig</li>
            <li>sudo chmod +x wpig</li>
            <li>echo "export PATH=\$PATH:~/.bashCommand" >> ~/.bashrc</li>
            <li>source ~/.bashrc</li>
        </ul>
    </li>
    <li>??????????</li>
    <li>Profit</li>
</ul>
<ul><h2><i>Windows</i></h2>
    <li>??????????</li>
    <li>??????????</li>
    <li>??????????</li>
</ul>

# HOW TO USE
<h7>Enter "wpig" in terminal then press enter and write text, then enter.</h7>
<h3>Parameters</h3>
<ul>
    <li><b>-s</b> --> send text 
        (when you don't want to press enter and then write text), example:
        <ul><b>wpig -s Hello</b> --> result Hello</ul>
    </li>
    <li><b>-r</b> --> repeat text, example:
        <ul><b>wpig -s www -r 2</b> --> result www www</ul>
    </li>
    <li><b>-t</b> --> translate text, example:
        <ul><b>wpig -s Hello -t ru</b> --> result Привет</ul>
    </li>
    <li><b>-l</b> --> language (send to pig a language default ru-RU), example:
        <ul><b>wpig -s Hello -l en-US</b> --> result pig read your message in english</ul>
    </li>
    <li><b>-n</b> --> name, select who read your text, example:
        <ul><b>wpig -s Hello -n Salli</b> --> result Salli read your message in english</ul>
    </li>
</ul>

<h5>If you want to see all names or languages write list, example:</h5>
wpig -l list
<br/>
wpig -n list
<br/>
wpig -t list


