//
//  DeviceIdentification.swift
//  MidtownAlliance
//
//  Created by Snehi Vallurupalli on 4/6/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit

public extension UIDevice {
  
  var modelName: String {
    var systemInfo = utsname()
    uname(&systemInfo)
    let machineMirror = Mirror(reflecting: systemInfo.machine)
    let identifier = machineMirror.children.reduce("") { identifier, element in
      guard let value = element.value as? Int8, value != 0 else { return identifier }
      return identifier + String(UnicodeScalar(UInt8(value)))
    }
    
    switch identifier {
    case "iPod5,1":                                 return "iPod Touch 5"
    case "iPod7,1":                                 return "iPod Touch 6"
    case "iPhone3,1", "iPhone3,2", "iPhone3,3":     return "iPhone 4"
    case "iPhone4,1":                               return "iPhone 4s"
    case "iPhone5,1", "iPhone5,2":                  return "iPhone 5"
    case "iPhone5,3", "iPhone5,4":                  return "iPhone 5c"
    case "iPhone6,1", "iPhone6,2":                  return "iPhone 5s"
    case "iPhone7,2":                               return "iPhone 6"
    case "iPhone7,1":                               return "iPhone 6 Plus"
    case "iPhone8,1":                               return "iPhone 6s"
    case "iPhone8,2":                               return "iPhone 6s Plus"
    case "iPhone9,1", "iPhone9,3":                  return "iPhone 7"
    case "iPhone9,2", "iPhone9,4":                  return "iPhone 7 Plus"
    case "iPhone8,4":                               return "iPhone SE"
    case "iPhone10,1", "iPhone10,4":                return "iPhone 8"
    case "iPhone10,2", "iPhone10,5":                return "iPhone 8 Plus"
    case "iPhone10,3", "iPhone10,6":                return "iPhone X"
    case "iPhone11,2":                              return "iPhone XS"
    case "iPhone11,4", "iPhone11,6":                return "iPhone XS Max"
    case "iPhone11,8":                              return "iPhone XR"
    case "i386", "x86_64":                          return "Simulator"
    default:                                        return identifier
    }
  }
  
  var tallScreen: Bool {
    var systemInfo = utsname()
    uname(&systemInfo)
    let machineMirror = Mirror(reflecting: systemInfo.machine)
    let identifier = machineMirror.children.reduce("") { identifier, element in
      guard let value = element.value as? Int8, value != 0 else { return identifier }
      return identifier + String(UnicodeScalar(UInt8(value)))
    }
    
    switch identifier {
    case "iPod5,1":                                 return false
    case "iPod7,1":                                 return false
    case "iPhone3,1", "iPhone3,2", "iPhone3,3":     return false
    case "iPhone4,1":                               return false
    case "iPhone5,1", "iPhone5,2":                  return false
    case "iPhone5,3", "iPhone5,4":                  return false
    case "iPhone6,1", "iPhone6,2":                  return false
    case "iPhone7,2":                               return false
    case "iPhone7,1":                               return false
    case "iPhone8,1":                               return false
    case "iPhone8,2":                               return false
    case "iPhone9,1", "iPhone9,3":                  return false
    case "iPhone9,2", "iPhone9,4":                  return false
    case "iPhone8,4":                               return false
    case "iPhone10,1", "iPhone10,4":                return false
    case "iPhone10,2", "iPhone10,5":                return false
    case "i386", "x86_64":                          return false
    default:                                        return true
    }
  }
  
}
