run live reload =>

//camin
ionic capacitor run android -l --address=10.139.10.250

ionic capacitor run android -l --address=10.139.0.57

//home ionic capacitor run android -l --address=192.168.0.101

////////////////////WIFI DEBUG

adb devices adb tcpip 5555 adb tcpip 5555 adb connect :5555

//camin adb connect 10.139.1.188:5555

//home adb connect 192.168.0.102:5555 //

stay connect via USB

connect to your WIFI network (computer and mobile device both)

ping DeviceIP (must be have ping to your device)

adb kill-server

adb usb

adb tcpip 5555

unplug usb cable (as per @captain_majid 's comment) adb connect yourDeviceIP

adb devices (must be see two device names , one of them is by deviceIP)

unplug USB cable

/// /users/UID/CreatedGames

test