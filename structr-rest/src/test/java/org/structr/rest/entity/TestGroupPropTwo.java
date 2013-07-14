/**
 * Copyright (C) 2010-2013 Axel Morgner, structr <structr@structr.org>
 *
 * This file is part of structr <http://structr.org>.
 *
 * structr is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * structr is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with structr.  If not, see <http://www.gnu.org/licenses/>.
 */
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.structr.rest.entity;

import org.structr.common.PropertyView;
import org.structr.common.View;
import org.structr.core.entity.AbstractNode;
import org.structr.core.property.BooleanProperty;
import org.structr.core.property.DoubleProperty;
import org.structr.core.property.EnumProperty;
import org.structr.core.property.GroupProperty;
import org.structr.core.property.IntProperty;
import org.structr.core.property.LongProperty;
import org.structr.core.property.StringProperty;

/**
 *
 * @author alex
 */
public class TestGroupPropTwo extends AbstractNode{
	
	public static final GroupProperty gP1 = new GroupProperty("gP1", TestGroupPropTwo.class, new StringProperty("sP"),new IntProperty("iP"), new LongProperty("lP"), new DoubleProperty("dblP"), new BooleanProperty("bP"));
	
	public static final GroupProperty gP2 = new GroupProperty("gP2", TestGroupPropTwo.class, new EnumProperty<Counter>("eP",Counter.class));
	
	
	public static final View defaultView = new View(TestGroupPropTwo.class, PropertyView.Public,name,gP1,gP2);
		

	public enum Counter {

		one,two,three
	}
}


