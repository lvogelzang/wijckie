#!/usr/bin/expect

spawn ../1_make_module_definition.sh

expect -exact {Enter module name (e.g: "daily todo"): }
send "fragrance\r"

expect -exact {Enter the name of the module model ("fragrance module"): }
send "\r"

expect -exact {Enter the plural name ("fragrance modules"): }
send "\r"

expect -exact {Enter the short plural name ("modules"): }
send "\r"

expect -exact { Enter the name of the next field (""): }
send "\r"

expect -exact { Enter ordering space-separated ("order id"): }
send "\r"

expect -exact { Enter initial filters space-separated ("user=user"): }
send "\r"

expect -exact { Enter optional filters space-separated (""): }
send "\r"

expect -exact {Enter the name of the widget model ("fragrance widget"): }
send "\r"

expect -exact {Enter the plural name ("fragrance widgets"): }
send "\r"

expect -exact {Enter the short plural name ("widgets"): }
send "\r"

expect -exact { Enter the name of the next field (""): }
send "\r"

expect -exact { Enter ordering space-separated ("order id"): }
send "\r"

expect -exact { Enter initial filters space-separated ("module__user=user"): }
send "\r"

expect -exact { Enter optional filters space-separated ("module_id=module"): }
send "\r"

expect -exact {Enter the name of the an extra class (""): }
send "fragrance item\r"

expect -exact {Enter the plural name ("fragrance items"): }
send "\r"

expect -exact {Enter the short plural name ("items"): }
send "\r"

expect -exact { Enter the name of the next field (""): }
send "module\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "fixed enum value", "integer", "order"] ("foreign key"): }
send "foreign key\r"

expect -exact {   Enter editing mode ("read write once"): }
send "\r"

expect -exact {   Enter to ("wijckie_models.modules.fragrance.FragranceModule"): }
send "\r"

expect -exact {   Enter on_delete ("cascade"): }
send "\r"

expect -exact {   Enter is_parent ("true"): }
send "\r"

expect -exact {   Enter show in front-end tables ("false"): }
send "\r"

expect -exact { Enter the name of the next field (""): }
send "name\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "fixed enum value", "integer", "order"]: }
send "char\r"

expect -exact {   Enter editing mode ("read write"): }
send "\r"

expect -exact {   Enter min length (""): }
send "1\r"

expect -exact {   Enter max length (""): }
send "30\r"

expect -exact {   Enter show in front-end tables ("true"): }
send "\r"

expect -exact {   Enter is object link in table ("true"): }
send "\r"

expect -exact { Enter the name of the next field (""): }
send "brand\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "fixed enum value", "integer", "order"]: }
send "char\r"

expect -exact {   Enter editing mode ("read write"): }
send "\r"

expect -exact {   Enter min length (""): }
send "1\r"

expect -exact {   Enter max length (""): }
send "30\r"

expect -exact {   Enter show in front-end tables ("true"): }
send "\r"

expect -exact {   Enter is object link in table ("false"): }
send "\r"

expect -exact { Enter the name of the next field (""): }
send "price\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "fixed enum value", "integer", "order"]: }
send "integer\r"

expect -exact {   Enter editing mode ("read write"): }
send "\r"

expect -exact {   Enter min value (""): }
send "0\r"

expect -exact {   Enter max value (""): }
send "999\r"

expect -exact {   Enter show in front-end tables ("true"): }
send "false\r"

expect -exact { Enter the name of the next field (""): }
send "volume in cl\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "fixed enum value", "integer", "order"]: }
send "integer\r"

expect -exact {   Enter editing mode ("read write"): }
send "\r"

expect -exact {   Enter min value (""): }
send "0\r"

expect -exact {   Enter max value (""): }
send "100\r"

expect -exact {   Enter show in front-end tables ("true"): }
send "false\r"

expect -exact { Enter the name of the next field (""): }
send "first tried at\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "fixed enum value", "integer", "order"]: }
send "date time\r"

expect -exact {   Enter editing mode ("read write"): }
send "\r"

expect -exact {   Enter show in front-end tables ("true"): }
send "false\r"

expect -exact { Enter the name of the next field (""): }
send "rating\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "fixed enum value", "integer", "order"]: }
send "integer\r"

expect -exact {   Enter editing mode ("read write"): }
send "\r"

expect -exact {   Enter min value (""): }
send "0\r"

expect -exact {   Enter max value (""): }
send "10\r"

expect -exact {   Enter show in front-end tables ("true"): }
send "\r"

expect -exact { Enter the name of the next field (""): }
send "\r"

expect -exact { Enter ordering space-separated ("id"): }
send "\r"

expect -exact { Enter initial filters space-separated ("module__user=user"): }
send "\r"

expect -exact { Enter optional filters space-separated ("module_id=module"): }
send "\r"

expect -exact {Enter the name of the an extra class (""): }
send "\r"

expect eof
