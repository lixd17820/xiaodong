# android opencv的配置
## 做个记录，比较重要怕忘记了
-  测试第一行
File->New->Import module，找到OpenCV-android-sdk目录下sdk下java，增加该文件夹
-  Android模式下，点app，New -> Folder -> New Jni folder，自己创建一个名字，自定义一个文件夹，
-  复制D:\OpenCV-android-sdk\sdk\native\libs内的文件夹，删除多余的，留下so文件
-  #android.useDeprecatedNdk=true
-  #android.deprecatedNdkCompileLease=1510479944561
-  加上第一行，编译会出错误
-  按提示找到build文件下的Android.mk，project-root/module-root/build/intermediates/ndk/debug/Android.mk，复制到项目文件夹下，

-  Right-click on the module you would like to link to your native library, such as the app module, and select Link C++ Project with Gradle from the menu
-  选择 ndk-build，选择刚才的文件，编译成功！
https://developer.android.com/studio/projects/gradle-external-native-builds.html
https://developer.android.com/studio/projects/add-native-code.html