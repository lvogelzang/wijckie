#!/usr/bin/expect

spawn ../1_make_module_definition.sh

expect -exact {Enter module name (e.g: "daily todo"): }
send "fragrance\r"

expect -exact {Enter the name of the module model ("fragrance module"): }
send "\r"

expect -exact {Enter the short name ("module"): }
send "\r"

expect -exact {Enter the plural name ("fragrance modules"): }
send "\r"

expect -exact {Enter the short plural name ("modules"): }
send "\r"

expect -exact {Enter localized singular name for locale en_GB ("fragrance module"): }
send "\r"

expect -exact {Enter localized plural name for locale en_GB ("fragrance modules"): }
send "\r"

expect -exact {Enter localized singular name for locale nl (""): }
send "parfummodule\r"

expect -exact {Enter localized plural name for locale nl (""): }
send "parfummodules\r"

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

expect -exact {Enter the short name ("widget"): }
send "\r"

expect -exact {Enter the plural name ("fragrance widgets"): }
send "\r"

expect -exact {Enter the short plural name ("widgets"): }
send "\r"

expect -exact {Enter localized singular name for locale en_GB ("fragrance widget"): }
send "\r"

expect -exact {Enter localized plural name for locale en_GB ("fragrance widgets"): }
send "\r"

expect -exact {Enter localized singular name for locale nl (""): }
send "parfumwidget\r"

expect -exact {Enter localized plural name for locale nl (""): }
send "parfumwidgets\r"

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

expect -exact {Enter the short name ("item"): }
send "\r"

expect -exact {Enter the plural name ("fragrance items"): }
send "\r"

expect -exact {Enter the short plural name ("items"): }
send "\r"

expect -exact {Enter localized singular name for locale en_GB ("fragrance item"): }
send "\r"

expect -exact {Enter localized plural name for locale en_GB ("fragrance items"): }
send "\r"

expect -exact {Enter localized singular name for locale nl (""): }
send "parfumitem\r"

expect -exact {Enter localized plural name for locale nl (""): }
send "parfumitems\r"

expect -exact { Enter the name of the next field (""): }
send "module\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "date", "fixed enum value", "integer", "order", "file"] ("foreign key"): }
send "foreign key\r"

expect -exact {  Enter localized name for locale en_GB ("module"): }
send "\r"

expect -exact {  Enter localized name for locale nl ("module"): }
send "\r"

expect -exact {   Enter editing mode ['read only', 'read write', 'read write once'] ("read write once"): }
send "\r"

expect -exact {   Enter optional ("false"): }
send "\r"

expect -exact {   Enter to ("wijckie_models.modules.fragrance.FragranceModule"): }
send "\r"

expect -exact {   Enter on delete ['django.db.models.CASCADE'] ("django.db.models.CASCADE"): }
send "\r"

expect -exact {   Enter is parent ("true"): }
send "\r"

expect -exact {   Enter in table ("false"): }
send "\r"

expect -exact { Enter the name of the next field (""): }
send "name\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "date", "fixed enum value", "integer", "order", "file"] ("char"): }
send "\r"

expect -exact {  Enter localized name for locale en_GB ("name"): }
send "\r"

expect -exact {  Enter localized name for locale nl ("naam"): }
send "\r"

expect -exact {   Enter editing mode ['read only', 'read write', 'read write once'] ("read write"): }
send "\r"

expect -exact {   Enter optional ("false"): }
send "\r"

expect -exact {   Enter min length ("1"): }
send "\r"

expect -exact {   Enter max length ("30"): }
send "\r"

expect -exact {   Enter in table ("true"): }
send "\r"

expect -exact {   Enter is object link in table ("true"): }
send "\r"

expect -exact { Enter the name of the next field (""): }
send "brand\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "date", "fixed enum value", "integer", "order", "file"]: }
send "char\r"

expect -exact {  Enter localized name for locale en_GB ("brand"): }
send "\r"

expect -exact {  Enter localized name for locale nl (""): }
send "merk\r"

expect -exact {   Enter editing mode ['read only', 'read write', 'read write once'] ("read write"): }
send "\r"

expect -exact {   Enter optional ("false"): }
send "\r"

expect -exact {   Enter min length ("1"): }
send "\r"

expect -exact {   Enter max length ("30"): }
send "\r"

expect -exact {   Enter in table ("true"): }
send "\r"

expect -exact {   Enter is object link in table ("false"): }
send "\r"

expect -exact { Enter the name of the next field (""): }
send "price\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "date", "fixed enum value", "integer", "order", "file"]: }
send "integer\r"

expect -exact {  Enter localized name for locale en_GB ("price"): }
send "\r"

expect -exact {  Enter localized name for locale nl (""): }
send "prijs\r"

expect -exact {   Enter editing mode ['read only', 'read write', 'read write once'] ("read write"): }
send "\r"

expect -exact {   Enter optional ("false"): }
send "\r"

expect -exact {   Enter min value ("0"): }
send "\r"

expect -exact {   Enter max value ("999"): }
send "\r"

expect -exact {   Enter in table ("true"): }
send "false\r"

expect -exact { Enter the name of the next field (""): }
send "volume in cl\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "date", "fixed enum value", "integer", "order", "file"]: }
send "integer\r"

expect -exact {  Enter localized name for locale en_GB ("volume in cl"): }
send "volume (cl)\r"

expect -exact {  Enter localized name for locale nl (""): }
send "volume (cl)\r"

expect -exact {   Enter editing mode ['read only', 'read write', 'read write once'] ("read write"): }
send "\r"

expect -exact {   Enter optional ("false"): }
send "\r"

expect -exact {   Enter min value ("0"): }
send "0\r"

expect -exact {   Enter max value ("999"): }
send "100\r"

expect -exact {   Enter in table ("true"): }
send "false\r"

expect -exact { Enter the name of the next field (""): }
send "first tried at\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "date", "fixed enum value", "integer", "order", "file"]: }
send "date time\r"

expect -exact {  Enter localized name for locale en_GB ("first tried at"): }
send "\r"

expect -exact {  Enter localized name for locale nl (""): }
send "eerste gebruik\r"

expect -exact {   Enter editing mode ['read only', 'read write', 'read write once'] ("read write"): }
send "\r"

expect -exact {   Enter optional ("false"): }
send "true\r"

expect -exact {   Enter in table ("true"): }
send "false\r"

expect -exact { Enter the name of the next field (""): }
send "rating\r"

expect -exact {  Enter the type ["char", "text", "foreign key", "created at", "date time", "date", "fixed enum value", "integer", "order", "file"]: }
send "integer\r"

expect -exact {  Enter localized name for locale en_GB ("rating"): }
send "\r"

expect -exact {  Enter localized name for locale nl (""): }
send "score\r"

expect -exact {   Enter editing mode ['read only', 'read write', 'read write once'] ("read write"): }
send "\r"

expect -exact {   Enter optional ("false"): }
send "\r"

expect -exact {   Enter min value ("0"): }
send "0\r"

expect -exact {   Enter max value ("999"): }
send "10\r"

expect -exact {   Enter in table ("true"): }
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
