package org.structr.cloud.message;

import java.security.InvalidKeyException;
import org.structr.cloud.CloudConnection;
import org.structr.cloud.CloudContext;
import org.structr.common.error.FrameworkException;
import org.structr.core.auth.AuthHelper;
import org.structr.core.entity.Principal;

/**
 *
 * @author Christian Morgner
 */


public class AuthenticationContainer implements Message {

	private transient String encryptionKey = null;

	private String userName = null;
	private String salt     = null;

	public AuthenticationContainer() {}

	public AuthenticationContainer(String userName) {

		this.userName = userName;
	}

	/**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getSalt() {
		return salt;
	}

	public String getEncryptionKey(final String password) {

		if (salt != null) {
			return AuthHelper.getHash(password, salt);
		}

		return AuthHelper.getSimpleHash(password);
	}

	@Override
	public Message process(CloudConnection connection, final CloudContext context) {

		final Principal user = context.getUser(userName);
		if (user != null) {

			this.encryptionKey = user.getEncryptedPassword();
			this.salt          = user.getProperty(Principal.salt);

			try {
				// FIXME: can we do this here?
				context.impersonateUser(user);

				return this;

			} catch (FrameworkException fex) {
				fex.printStackTrace();
			}
		}

		context.endTransaction();
		connection.closeConnection();

		return null;
	}

	@Override
	public void postProcess(CloudConnection connection, CloudContext context) {

		try {
			connection.setEncryptionKey(encryptionKey);

		} catch (InvalidKeyException ikex) {
			ikex.printStackTrace();
		}
	}

	@Override
	public Object getPayload() {
		return null;
	}
}