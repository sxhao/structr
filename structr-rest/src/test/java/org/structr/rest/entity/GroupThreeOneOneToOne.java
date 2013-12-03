package org.structr.rest.entity;

import org.structr.core.entity.OneToOne;

/**
 *
 * @author Christian Morgner
 */
public class GroupThreeOneOneToOne extends OneToOne<TestGroupPropThree, TestGroupPropOne> {

	@Override
	public Class<TestGroupPropThree> getSourceType() {
		return TestGroupPropThree.class;
	}

	@Override
	public Class<TestGroupPropOne> getTargetType() {
		return TestGroupPropOne.class;
	}

	@Override
	public String name() {
		return "OWNS";
	}
}
