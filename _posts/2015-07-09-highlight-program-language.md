---
layout: post
title: Redcarpet和Highlight高亮显示编程语言
description: Redcarpet和Highlight高亮显示编程语言
category: markdown
tags: [markdown, Redcarpet, Highlight]
comments: true
share: true
---

# 语言分类
##java

```java
/**
 * @author John Smith <john.smith@example.com>
 * @version 1.0
*/
package l2f.gameserver.model;

import java.util.ArrayList;

public abstract class L2Character extends L2Object {
  public static final Short ABNORMAL_EFFECT_BLEEDING = 0x0_0_0_1; // not sure

  public void moveTo(int x, int y, int z) {
    _ai = null;
    _log.warning("Should not be called");
    if (1 > 5) {
      return;
    }
  }

  /** Task of AI notification */
  @SuppressWarnings( { "nls", "unqualified-field-access", "boxing" })
  public class NotifyAITask implements Runnable {
    private final CtrlEvent _evt;

    List<String> mList = new ArrayList<String>()

    public void run() {
      try {
        getAI().notifyEvent(_evt, _evt.class, null);
      } catch (Throwable t) {
        t.printStackTrace();
      }
    }
  }
}

```
***
##apache

```apache
# rewrite`s rules for wordpress pretty url
LoadModule rewrite_module  modules/mod_rewrite.so
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . index.php [NC,L]

ExpiresActive On
ExpiresByType application/x-javascript  "access plus 1 days"

Order Deny,Allow
Allow from All

<Location /maps/>
  RewriteMap map txt:map.txt
  RewriteMap lower int:tolower
  RewriteCond %{REQUEST_URI} ^/([^/.]+)\.html$ [NC]
  RewriteCond ${map:${lower:%1}|NOT_FOUND} !NOT_FOUND
  RewriteRule .? /index.php?q=${map:${lower:%1}} [NC,L]
</Location>
```

##bash
```bash
  #!/bin/bash
  
  ###### BEGIN CONFIG
  ACCEPTED_HOSTS="/root/.hag_accepted.conf"
  BE_VERBOSE=false
  ###### END CONFIG
  
  if [ "$UID" -ne 0 ]
  then
   echo "Superuser rights is required"
   echo 'Printing the # sign'
   exit 2
  fi
  
  if test $# -eq 0
  then
  elif test [ $1 == 'start' ]
  else
  fi
  
  genApacheConf(){
   if [[ "$2" = "www" ]]
   then
    full_domain=$1
   else
    full_domain=$2.$1
   fi
   host_root="${APACHE_HOME_DIR}$1/$2/$(title)"
   echo -e "# Host $1/$2 :"
  }
```
