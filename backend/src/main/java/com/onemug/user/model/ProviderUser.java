package com.onemug.user.model;

import java.util.Map;

public interface ProviderUser {

    String getId();
    String getUsername();
    String getPassword();
    String getEmail();
    Map<String, Object> getAttributes();
}
